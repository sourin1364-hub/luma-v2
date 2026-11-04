/**
 * موتور تولید موسیقی محیطی آرامش‌بخش (Ambient Cosmic Music Synthesizer)
 * با استفاده از Web Audio API - بدون نیاز به فایل صوتی سنگین خارجی و بدون قطعی
 */
export type MusicTrackId = 'cosmos' | 'ocean' | 'fire' | 'rain' | 'forest';

export interface MusicTrack {
  id: MusicTrackId;
  nameFa: string;
  description: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'cosmos', nameFa: 'مراقبه کیهانی (۴۳۲ هرتز)', description: 'فرکانس آرامش‌بخش ستارگان و کهکشان' },
  { id: 'ocean', nameFa: 'امواج آرام اقیانوس (عنصر آب)', description: 'صدای موج‌های ملایم دریا در شب' },
  { id: 'fire', nameFa: 'گرمای شعله‌های آتش (عنصر آتش)', description: 'زمزمه گرم و آرامش‌بخش آتش' },
  { id: 'rain', nameFa: 'نسیم و ابرهای بارانی (عنصر باد)', description: 'نوازش باد ملایم و باران لطیف' },
  { id: 'forest', nameFa: 'طبیعت سبز و زمین (عنصر خاک)', description: 'هارمونی آرامش‌بخش زمین و رویش' },
];

class AmbientMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrack: MusicTrackId = 'cosmos';
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private intervalId: number | null = null;

  public start(trackId: MusicTrackId = this.currentTrack) {
    this.stop();
    this.currentTrack = trackId;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.5);
      this.masterGain.connect(this.ctx.destination);

      if (trackId === 'cosmos') {
        this.buildChordPad([216, 270, 324, 432]);
      } else if (trackId === 'ocean') {
        this.buildOceanWaves();
        this.buildChordPad([174, 261.6, 392]);
      } else if (trackId === 'fire') {
        this.buildWarmFire();
        this.buildChordPad([196, 246.9, 293.6]);
      } else if (trackId === 'rain') {
        this.buildSoftWind();
        this.buildChordPad([220, 277.1, 329.6]);
      } else {
        this.buildChordPad([256, 320, 384, 512]);
      }

      this.isPlaying = true;
    } catch (e) {
      console.warn('Ambient audio start error:', e);
    }
  }

  private buildChordPad(frequencies: number[]) {
    if (!this.ctx || !this.masterGain) return;
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12 + idx * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06 / frequencies.length, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      lfo.start();
      this.nodes.push(osc, gain, lfo, lfoGain);
    });
  }

  private buildOceanWaves() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.nodes.push(noise, filter, lfo, lfoGain, waveGain);
  }

  private buildWarmFire() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.98 ? 0.8 : 0.15);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise, filter, gain);
  }

  private buildSoftWind() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.nodes.push(noise, filter, gain);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.nodes.forEach((n) => {
      try {
        (n as any).stop?.();
        n.disconnect();
      } catch {}
    });
    this.nodes = [];
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
    this.isPlaying = false;
  }

  public toggle(trackId?: MusicTrackId): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(trackId || this.currentTrack);
      return true;
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
    };
  }
}

export const ambientMusic = new AmbientMusicEngine();
