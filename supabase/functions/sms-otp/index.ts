import {
  authenticatedUser,
  corsHeaders,
  isOptions,
  jsonResponse,
  serviceClient,
  sha256,
} from '../_shared/http.ts';

type Purpose = 'login' | 'password-reset';

function normalizePhone(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const digits = value.replace(/[^\d]/g, '');
  const core = digits.startsWith('98') && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith('0') && digits.length === 11
    ? digits.slice(1)
    : digits;
  return /^9\d{9}$/.test(core) ? `0${core}` : null;
}

async function requestSms(phone: string, code: string): Promise<void> {
  const apiKey = Deno.env.get('MELIPAYAMAK_API_KEY');
  const bodyId = Deno.env.get('MELIPAYAMAK_PATTERN_CODE');
  const sender = Deno.env.get('MELIPAYAMAK_SENDER');
  if (!apiKey || !bodyId || !/^\d+$/.test(bodyId)) {
    throw new Error('Melipayamak API key and numeric pattern code must be configured.');
  }

  const response = await fetch(`https://console.melipayamak.com/api/send/shared/${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bodyId: Number(bodyId),
      to: phone,
      args: [code],
      ...(sender ? { from: sender } : {}),
    }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.status === 'error' || result?.success === false) {
    console.error('Melipayamak rejected OTP request:', response.status);
    throw new Error('SMS provider rejected the request.');
  }
}

async function issueCode(phone: string, purpose: Purpose, request: Request): Promise<Response> {
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ipHash = await sha256(ip);
  const db = serviceClient();
  const { data, error } = await db.rpc('luma_issue_sms_otp', {
    p_phone: phone,
    p_purpose: purpose,
    p_code_hash: await sha256(`${phone}:${code}`),
    p_ip_hash: ipHash,
  });
  if (error) throw error;
  if (data !== true) return jsonResponse({ sent: false, message: 'Please wait before requesting another code.' }, 429);

  try {
    await requestSms(phone, code);
  } catch (error) {
    await db.from('sms_otp_challenges').delete().eq('phone', phone);
    throw error;
  }
  return jsonResponse({ sent: true, message: 'Verification code sent.' });
}

async function verifyCode(phone: string, purpose: Purpose, code: string): Promise<Response> {
  const db = serviceClient();
  const { data: valid, error } = await db.rpc('luma_consume_sms_otp', {
    p_phone: phone,
    p_purpose: purpose,
    p_code_hash: await sha256(`${phone}:${code}`),
  });
  if (error) throw error;
  if (valid !== true) return jsonResponse({ verified: false });

  const email = `98${phone.slice(1)}@luma.ir`;
  const admin = db.auth.admin;
  let link = await admin.generateLink({ type: 'magiclink', email });
  if (link.error) {
    if (purpose === 'password-reset') return jsonResponse({ verified: false });

    const created = await admin.createUser({
      email,
      email_confirm: true,
      password: crypto.randomUUID(),
      user_metadata: { phone, username: phone, display_name: phone },
    });
    if (created.error && !created.error.message.toLowerCase().includes('already')) {
      console.error('Could not provision verified SMS account:', created.error.message);
      throw new Error('Could not create the account for this verified phone number.');
    }
    link = await admin.generateLink({ type: 'magiclink', email });
  }

  const tokenHash = link.data?.properties?.hashed_token;
  if (link.error || !tokenHash) {
    console.error('Could not issue the verified SMS sign-in link:', link.error?.message);
    throw new Error('Could not complete secure sign-in for this phone number.');
  }
  return jsonResponse({ verified: true, tokenHash });
}

Deno.serve(async (request) => {
  if (isOptions(request)) return new Response('ok', { headers: { ...corsHeaders, 'Content-Length': '0' } });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  try {
    const body = await request.json();
    const purpose: Purpose = body.purpose === 'password-reset' ? 'password-reset' : 'login';
    const phone = normalizePhone(body.phone);
    if (!phone) return jsonResponse({ error: 'Invalid mobile number.' }, 400);

    if (body.action === 'send') {
      if (purpose === 'password-reset') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
          const user = await authenticatedUser(request).catch(() => null);
          if (user && user.user_metadata?.phone !== phone && user.phone !== phone) {
            return jsonResponse({ error: 'This phone number is not linked to the signed-in account.' }, 403);
          }
        }
      }
      return await issueCode(phone, purpose, request);
    }
    if (body.action === 'verify') {
      const code = typeof body.code === 'string' ? body.code.replace(/\D/g, '') : '';
      if (!/^\d{6}$/.test(code)) return jsonResponse({ verified: false }, 400);
      return await verifyCode(phone, purpose, code);
    }
    return jsonResponse({ error: 'Unsupported SMS action.' }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected SMS service error.';
    console.error('SMS OTP function failed:', message);
    return jsonResponse({ error: message }, 500);
  }
});
