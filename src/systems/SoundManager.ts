/** Procedural sound effects using Web Audio API — no audio files needed */
export class SoundManager {
  private ctx?: AudioContext;

  private getCtx(): AudioContext | null {
    try {
      if (!this.ctx) this.ctx = new AudioContext();
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = "sine",
    vol = 0.25,
    delay = 0
  ): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  /** Sweep from one frequency to another */
  private sweep(
    from: number,
    to: number,
    dur: number,
    type: OscillatorType = "sine",
    vol = 0.2
  ): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + dur);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  /** Noise burst (for percussive sounds) */
  private noise(dur: number, vol = 0.1): void {
    const ctx = this.getCtx();
    if (!ctx) return;
    const bufSize = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  // --- Game sounds ---

  move(): void {
    this.tone(300, 0.04, "sine", 0.08);
  }

  collectStar(): void {
    this.tone(660, 0.1, "sine", 0.2);
    this.tone(880, 0.15, "sine", 0.25, 0.08);
  }

  collectCoin(): void {
    this.tone(1200, 0.06, "square", 0.12);
    this.tone(1600, 0.1, "square", 0.12, 0.05);
  }

  collectKey(): void {
    this.tone(523, 0.08, "sine", 0.2);
    this.tone(659, 0.08, "sine", 0.2, 0.07);
    this.tone(784, 0.12, "sine", 0.2, 0.14);
  }

  gateOpen(): void {
    this.tone(400, 0.12, "triangle", 0.2);
    this.tone(600, 0.12, "triangle", 0.2, 0.1);
    this.tone(800, 0.18, "triangle", 0.2, 0.2);
  }

  barrierUnlock(): void {
    this.noise(0.08, 0.15);
    this.tone(350, 0.1, "sawtooth", 0.12, 0.05);
    this.tone(500, 0.15, "triangle", 0.15, 0.12);
  }

  teleport(): void {
    this.sweep(1000, 300, 0.25, "sine", 0.2);
    this.sweep(300, 800, 0.2, "sine", 0.15);
  }

  trapHit(): void {
    this.tone(200, 0.25, "sawtooth", 0.25);
    this.tone(150, 0.3, "square", 0.15, 0.05);
    this.noise(0.15, 0.2);
  }

  correctAnswer(): void {
    this.tone(523, 0.1, "sine", 0.2);
    this.tone(659, 0.1, "sine", 0.2, 0.09);
    this.tone(784, 0.18, "sine", 0.25, 0.18);
  }

  wrongAnswer(): void {
    this.tone(300, 0.18, "square", 0.15);
    this.tone(230, 0.25, "square", 0.15, 0.12);
  }

  exitUnlock(): void {
    this.tone(523, 0.08, "sine", 0.2);
    this.tone(659, 0.08, "sine", 0.2, 0.07);
    this.tone(784, 0.08, "sine", 0.2, 0.14);
    this.tone(1047, 0.25, "sine", 0.3, 0.21);
  }

  levelComplete(): void {
    this.tone(523, 0.12, "sine", 0.2);
    this.tone(659, 0.12, "sine", 0.2, 0.1);
    this.tone(784, 0.12, "sine", 0.2, 0.2);
    this.tone(1047, 0.35, "sine", 0.3, 0.3);
  }
}

export const sfx = new SoundManager();
