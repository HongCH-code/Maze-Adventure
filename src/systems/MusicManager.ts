/** Background music manager — handles looping BGM with crossfade between tracks */
export class MusicManager {
  private scene?: Phaser.Scene;
  private current?: Phaser.Sound.BaseSound;
  private currentKey = "";
  private volume = 0.3;

  /** Bind to a Phaser scene (call once from BootScene.create or first scene) */
  bind(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  /** Play a track by key. No-op if already playing that track. */
  play(key: string): void {
    if (!this.scene) return;
    if (this.currentKey === key) return;

    this.stop();
    // Ensure the audio key exists before playing
    if (!this.scene.cache.audio.exists(key)) return;
    this.current = this.scene.sound.add(key, {
      loop: true,
      volume: this.volume,
    });
    this.current.play();
    this.currentKey = key;
  }

  /** Stop current track */
  stop(): void {
    if (this.current) {
      this.current.stop();
      this.current.destroy();
      this.current = undefined;
      this.currentKey = "";
    }
  }

  /** Check if a specific track is playing */
  isPlaying(key: string): boolean {
    return this.currentKey === key;
  }
}

export const music = new MusicManager();
