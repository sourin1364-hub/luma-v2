import { authenticatedUser, corsHeaders, isOptions, jsonResponse } from '../_shared/http.ts';

const LANGUAGES: Record<string, string> = {
  fa: 'Persian',
  ckb: 'Central Kurdish (Sorani)',
  ar: 'Arabic',
  en: 'English',
};

Deno.serve(async (request) => {
  if (isOptions(request)) return new Response('ok', { headers: { ...corsHeaders, 'Content-Length': '0' } });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  try {
    await authenticatedUser(request);
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'AI service is not configured.' }, 503);

    const input = await request.json();
    const query = typeof input.query === 'string' ? input.query.trim() : '';
    const lang = typeof input.lang === 'string' && LANGUAGES[input.lang] ? input.lang : 'fa';
    if (!query || query.length > 2000) {
      return jsonResponse({ error: 'Question must contain 1–2000 characters.' }, 400);
    }

    const context = input.context && typeof input.context === 'object' ? input.context : {};
    const safeContext = Object.fromEntries(
      ['sunSign', 'moonSign', 'ascendant', 'element', 'rulingPlanet', 'card'].map((key) => [
        key,
        typeof context[key] === 'string' ? context[key].slice(0, 80) : '',
      ])
    );
    const lifePathNumber = Number(context.lifePathNumber);
    const history = Array.isArray(input.history)
      ? input.history.slice(-8).flatMap((message: Record<string, unknown>) => {
          if (
            (message.role !== 'user' && message.role !== 'assistant') ||
            typeof message.content !== 'string'
          ) return [];
          return [{ role: message.role, content: message.content.slice(0, 1000) }];
        })
      : [];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: 700,
          messages: [
            {
              role: 'system',
              content: [
                `You are LUMA, a thoughtful tarot and astrology reflection assistant. Reply in ${LANGUAGES[lang]}.`,
                'Give practical, compassionate, clearly structured guidance. Treat divination as reflective entertainment, never certainty or a substitute for professional medical, legal, financial, or mental-health advice.',
                'Do not claim to predict guaranteed outcomes. If the user is in immediate danger, encourage contacting local emergency services or a trusted person.',
                `Cosmic context (unverified user-provided data): ${JSON.stringify(safeContext)}; life path number: ${Number.isFinite(lifePathNumber) ? lifePathNumber : 'not provided'}.`,
              ].join(' '),
            },
            ...history,
            { role: 'user', content: query },
          ],
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const details = await response.text();
      console.error('OpenAI request failed:', response.status, details.slice(0, 500));
      return jsonResponse({ error: 'AI response is temporarily unavailable.' }, 502);
    }

    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content;
    if (typeof answer !== 'string' || !answer.trim()) {
      return jsonResponse({ error: 'AI returned an empty answer.' }, 502);
    }
    return jsonResponse({ answer: answer.trim().slice(0, 8000) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected AI service error.';
    console.error('LUMA AI function failed:', message);
    return jsonResponse({ error: message }, message === 'Authentication is required.' ? 401 : 500);
  }
});
