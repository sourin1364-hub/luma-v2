/**
 * پخش صدای برگرداندن کارت با Web Audio API
 * (بدون نیاز به فایل صوتی خارجی)
 */
export function playCardFlipSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    setTimeout(() => ctx.close(), 220);
  } catch (e) {}
}

/**
 * پخش صدای انتخاب کارت (کوتاه‌تر)
 */
export function playCardSelectSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);

    setTimeout(() => ctx.close(), 150);
  } catch (e) {}
}

/**
 * پخش صدای بر زدن دسته کارت‌ها (Riffle Shuffle Sound)
 */
export function playDeckShuffleSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const totalTicks = 12;

    for (let i = 0; i < totalTicks; i++) {
      const startTime = ctx.currentTime + i * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + (i % 4) * 90, startTime);
      osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.045);

      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.05);
    }

    setTimeout(() => ctx.close(), 1400);
  } catch (e) {}
}
