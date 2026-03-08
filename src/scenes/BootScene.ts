import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    // Loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222244, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    const loadingText = this.add
      .text(width / 2, height / 2 - 40, "Loading...", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x4a90d9, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Generate placeholder textures programmatically
    this.generatePlaceholderTextures();
  }

  create(): void {
    this.scene.start("ProfileSelectScene");
  }

  private generatePlaceholderTextures(): void {
    const s = 32; // tile size

    // Wall tile - dark gray
    this.createColorTexture("wall", s, s, 0x444466);

    // Path tile - light beige
    this.createColorTexture("path", s, s, 0xe8dcc8);

    // Start tile - path color with a person icon
    this.createStartTexture(s);

    // Exit tile - open (flag) and locked (flag + lock)
    this.createExitTexture(s, false);
    this.createExitLockedTexture(s);

    // Player - small person icon
    this.createPlayerTexture(s);

    // Star - gold 5-point star shape
    this.createStarShape(s);

    // Coin - silver
    this.createCircleTexture("coin", s * 0.5, 0xc0c0c0);

    // Key - orange key shape
    this.createKeyShape(s);

    // Gate locked (puzzle) - red with "?" mark
    this.createGateTexture(s);

    // Barrier locked (key required) - brown wooden barrier
    this.createBarrierTexture(s);

    // Button placeholder
    this.createColorTexture("btn", 200, 50, 0x4a90d9);

    // D-pad button
    this.createColorTexture("dpad_btn", 60, 60, 0xffffff);

    // Teleport portal
    this.createTeleportTexture(s);

    // Trap (danger spikes)
    this.createTrapTexture(s);

    // Ocean theme textures
    this.createOceanWallTexture(s);
    this.createOceanPathTexture(s);
    this.createStarfishTexture(s);
    this.createPearlTexture(s);
    this.createShellTexture(s);
    this.createWhirlpoolTexture(s);
    this.createJellyfishTexture(s);
    this.createWaterCurrentTexture(s);
    this.createFogTexture(s);
  }

  private createStartTexture(s: number): void {
    const g = this.add.graphics();
    // Path background
    g.fillStyle(0xe8dcc8, 1);
    g.fillRect(0, 0, s, s);
    // Person silhouette (simple)
    g.fillStyle(0x4488cc, 1);
    g.fillCircle(s / 2, s * 0.3, s * 0.15); // head
    g.fillTriangle(s / 2, s * 0.42, s * 0.3, s * 0.85, s * 0.7, s * 0.85); // body
    g.generateTexture("start", s, s);
    g.destroy();
  }

  private createExitTexture(s: number, _locked: boolean): void {
    const g = this.add.graphics();
    // Path background
    g.fillStyle(0xe8dcc8, 1);
    g.fillRect(0, 0, s, s);
    // Flag pole
    g.fillStyle(0x666666, 1);
    g.fillRect(s * 0.25, s * 0.15, s * 0.06, s * 0.7);
    // Flag (green triangle)
    g.fillStyle(0x33cc66, 1);
    g.fillTriangle(s * 0.31, s * 0.15, s * 0.31, s * 0.5, s * 0.78, s * 0.32);
    g.generateTexture("exit", s, s);
    g.destroy();
  }

  private createExitLockedTexture(s: number): void {
    const g = this.add.graphics();
    // Path background
    g.fillStyle(0xe8dcc8, 1);
    g.fillRect(0, 0, s, s);
    // Flag pole
    g.fillStyle(0x666666, 1);
    g.fillRect(s * 0.25, s * 0.15, s * 0.06, s * 0.7);
    // Flag (red triangle - locked)
    g.fillStyle(0xcc3333, 1);
    g.fillTriangle(s * 0.31, s * 0.15, s * 0.31, s * 0.5, s * 0.78, s * 0.32);
    // Lock icon (small square + arc)
    g.fillStyle(0xffcc00, 1);
    g.fillRect(s * 0.55, s * 0.6, s * 0.25, s * 0.22);
    g.lineStyle(2, 0xffcc00, 1);
    g.beginPath();
    g.arc(s * 0.675, s * 0.6, s * 0.09, Math.PI, 0, false);
    g.strokePath();
    g.generateTexture("exit_locked", s, s);
    g.destroy();
  }

  private createStarShape(s: number): void {
    const g = this.add.graphics();
    const cx = s * 0.4;
    const cy = s * 0.4;
    const outer = s * 0.35;
    const inner = s * 0.15;
    g.fillStyle(0xffd700, 1);
    g.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      g.lineTo(cx + Math.cos(outerAngle) * outer, cy + Math.sin(outerAngle) * outer);
      g.lineTo(cx + Math.cos(innerAngle) * inner, cy + Math.sin(innerAngle) * inner);
    }
    g.closePath();
    g.fillPath();
    g.generateTexture("star", Math.ceil(s * 0.8), Math.ceil(s * 0.8));
    g.destroy();
  }

  private createKeyShape(s: number): void {
    const g = this.add.graphics();
    const size = s * 0.7;
    g.fillStyle(0xff8800, 1);
    // Key head (circle with hole)
    g.fillCircle(size * 0.3, size * 0.35, size * 0.25);
    g.fillStyle(0x000000, 0.3);
    g.fillCircle(size * 0.3, size * 0.35, size * 0.1);
    // Key shaft
    g.fillStyle(0xff8800, 1);
    g.fillRect(size * 0.45, size * 0.28, size * 0.45, size * 0.14);
    // Key teeth
    g.fillRect(size * 0.75, size * 0.42, size * 0.1, size * 0.12);
    g.fillRect(size * 0.85, size * 0.42, size * 0.1, size * 0.08);
    g.generateTexture("key", Math.ceil(size), Math.ceil(size));
    g.destroy();
  }

  private createGateTexture(s: number): void {
    const g = this.add.graphics();
    g.fillStyle(0xcc3333, 1);
    g.fillRect(0, 0, s, s);
    // "?" mark
    g.fillStyle(0xffffff, 1);
    g.fillCircle(s / 2, s * 0.35, s * 0.12);
    g.fillStyle(0xcc3333, 1);
    g.fillCircle(s / 2, s * 0.3, s * 0.06);
    g.fillStyle(0xffffff, 1);
    g.fillRect(s * 0.44, s * 0.4, s * 0.12, s * 0.2);
    g.fillCircle(s / 2, s * 0.72, s * 0.06);
    g.generateTexture("gate_locked", s, s);
    g.destroy();
  }

  private createBarrierTexture(s: number): void {
    const g = this.add.graphics();
    // Wooden barrier look
    g.fillStyle(0x8b6914, 1);
    g.fillRect(0, 0, s, s);
    // Horizontal planks
    g.lineStyle(2, 0x6b4f12, 1);
    g.lineBetween(0, s * 0.33, s, s * 0.33);
    g.lineBetween(0, s * 0.66, s, s * 0.66);
    // Lock symbol
    g.fillStyle(0xffcc00, 1);
    g.fillRect(s * 0.35, s * 0.38, s * 0.3, s * 0.25);
    g.lineStyle(2, 0xffcc00, 1);
    g.beginPath();
    g.arc(s / 2, s * 0.38, s * 0.1, Math.PI, 0, false);
    g.strokePath();
    g.generateTexture("barrier_locked", s, s);
    g.destroy();
  }

  private createPlayerTexture(s: number): void {
    const g = this.add.graphics();
    // Head - yellow circle at top center
    g.fillStyle(0xffcc00, 1);
    g.fillCircle(s / 2, s * 0.22, s * 0.14);
    // Body - blue rectangle below head
    g.fillStyle(0x4488cc, 1);
    g.fillRect(s * 0.35, s * 0.36, s * 0.3, s * 0.3);
    // Left leg
    g.fillRect(s * 0.35, s * 0.68, s * 0.12, s * 0.22);
    // Right leg
    g.fillRect(s * 0.53, s * 0.68, s * 0.12, s * 0.22);
    g.generateTexture("player", s, s);
    g.destroy();
  }

  private createTeleportTexture(s: number): void {
    const size = Math.ceil(s * 0.8);
    const cx = size / 2;
    const cy = size / 2;
    const g = this.add.graphics();
    // Outer circle ring (purple)
    g.lineStyle(3, 0xaa44ff, 1);
    g.strokeCircle(cx, cy, size * 0.42);
    // Inner circle (lighter purple)
    g.fillStyle(0xdd88ff, 0.6);
    g.fillCircle(cx, cy, size * 0.25);
    // Center dot (white)
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx, cy, size * 0.07);
    g.generateTexture("teleport", size, size);
    g.destroy();
  }

  private createTrapTexture(s: number): void {
    const size = Math.ceil(s * 0.8);
    const cx = size / 2;
    const cy = size / 2;
    const g = this.add.graphics();
    // Red circle background
    g.fillStyle(0xcc2222, 0.9);
    g.fillCircle(cx, cy, size * 0.38);
    // White "X" danger mark
    g.lineStyle(4, 0xffffff, 1);
    const d = size * 0.2;
    g.lineBetween(cx - d, cy - d, cx + d, cy + d);
    g.lineBetween(cx - d, cy + d, cx + d, cy - d);
    // Outer spikes
    g.fillStyle(0xff4444, 1);
    const spikes = 8;
    for (let i = 0; i < spikes; i++) {
      const angle = (Math.PI * 2 * i) / spikes;
      const ix = cx + Math.cos(angle) * size * 0.28;
      const iy = cy + Math.sin(angle) * size * 0.28;
      const ox = cx + Math.cos(angle) * size * 0.45;
      const oy = cy + Math.sin(angle) * size * 0.45;
      const pa = angle + Math.PI / 2;
      const pw = size * 0.06;
      g.fillTriangle(
        ix + Math.cos(pa) * pw,
        iy + Math.sin(pa) * pw,
        ix - Math.cos(pa) * pw,
        iy - Math.sin(pa) * pw,
        ox,
        oy
      );
    }
    g.generateTexture("trap", size, size);
    g.destroy();
  }

  private createOceanWallTexture(s: number): void {
    const g = this.add.graphics();
    // Coral colored background
    g.fillStyle(0xe8856e, 1);
    g.fillRect(0, 0, s, s);
    // Subtle texture lines
    g.lineStyle(1, 0xd07060, 0.5);
    g.lineBetween(0, s * 0.25, s, s * 0.3);
    g.lineBetween(0, s * 0.55, s, s * 0.5);
    g.lineBetween(0, s * 0.8, s, s * 0.85);
    g.lineBetween(s * 0.3, 0, s * 0.25, s);
    g.lineBetween(s * 0.7, 0, s * 0.75, s);
    g.generateTexture("ocean_wall", s, s);
    g.destroy();
  }

  private createOceanPathTexture(s: number): void {
    const g = this.add.graphics();
    // Sandy floor background
    g.fillStyle(0xf5deb3, 1);
    g.fillRect(0, 0, s, s);
    // Subtle sand dots
    g.fillStyle(0xe0c8a0, 0.6);
    g.fillCircle(s * 0.2, s * 0.3, 1.5);
    g.fillCircle(s * 0.7, s * 0.15, 1);
    g.fillCircle(s * 0.5, s * 0.6, 1.5);
    g.fillCircle(s * 0.85, s * 0.75, 1);
    g.fillCircle(s * 0.15, s * 0.85, 1);
    g.fillCircle(s * 0.6, s * 0.9, 1.5);
    g.generateTexture("ocean_path", s, s);
    g.destroy();
  }

  private createStarfishTexture(s: number): void {
    const g = this.add.graphics();
    const cx = s * 0.4;
    const cy = s * 0.4;
    const outer = s * 0.35;
    const inner = s * 0.15;
    // Orange-red 5-point star shape
    g.fillStyle(0xff6347, 1);
    g.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      g.lineTo(cx + Math.cos(outerAngle) * outer, cy + Math.sin(outerAngle) * outer);
      g.lineTo(cx + Math.cos(innerAngle) * inner, cy + Math.sin(innerAngle) * inner);
    }
    g.closePath();
    g.fillPath();
    // Center dot highlight
    g.fillStyle(0xff8060, 1);
    g.fillCircle(cx, cy, s * 0.06);
    g.generateTexture("starfish", Math.ceil(s * 0.8), Math.ceil(s * 0.8));
    g.destroy();
  }

  private createPearlTexture(s: number): void {
    const g = this.add.graphics();
    const size = Math.ceil(s * 0.5);
    const cx = size / 2;
    const cy = size / 2;
    // White circle
    g.fillStyle(0xf0f0f0, 1);
    g.fillCircle(cx, cy, size * 0.42);
    // Highlight spot
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - size * 0.12, cy - size * 0.12, size * 0.12);
    g.generateTexture("pearl", size, size);
    g.destroy();
  }

  private createShellTexture(s: number): void {
    const g = this.add.graphics();
    const size = Math.ceil(s * 0.7);
    const cx = size / 2;
    const cy = size * 0.55;
    // Orange fan/shell shape
    g.fillStyle(0xffb347, 1);
    g.beginPath();
    g.arc(cx, cy, size * 0.4, Math.PI, 0, false);
    g.lineTo(cx, cy + size * 0.1);
    g.closePath();
    g.fillPath();
    // Ridges
    g.lineStyle(1, 0xe09030, 0.7);
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI + (Math.PI * (i + 1)) / 6;
      const rx = cx + Math.cos(angle) * size * 0.38;
      const ry = cy + Math.sin(angle) * size * 0.38;
      g.lineBetween(cx, cy + size * 0.1, rx, ry);
    }
    g.generateTexture("shell", size, size);
    g.destroy();
  }

  private createWhirlpoolTexture(s: number): void {
    const g = this.add.graphics();
    const cx = s / 2;
    const cy = s / 2;
    // Outer ring
    g.lineStyle(3, 0x0088cc, 0.8);
    g.strokeCircle(cx, cy, s * 0.4);
    // Middle ring
    g.lineStyle(2, 0x00aaee, 0.8);
    g.strokeCircle(cx, cy, s * 0.28);
    // Inner ring
    g.lineStyle(2, 0x0088cc, 0.8);
    g.strokeCircle(cx, cy, s * 0.16);
    // Dark center
    g.fillStyle(0x003366, 1);
    g.fillCircle(cx, cy, s * 0.08);
    g.generateTexture("whirlpool", s, s);
    g.destroy();
  }

  private createJellyfishTexture(s: number): void {
    const g = this.add.graphics();
    const cx = s / 2;
    // Pink dome (top half)
    g.fillStyle(0xff69b4, 0.85);
    g.beginPath();
    g.arc(cx, s * 0.35, s * 0.3, Math.PI, 0, false);
    g.closePath();
    g.fillPath();
    // Tentacle lines
    g.lineStyle(1.5, 0xff69b4, 0.7);
    g.lineBetween(s * 0.28, s * 0.35, s * 0.22, s * 0.75);
    g.lineBetween(s * 0.4, s * 0.35, s * 0.38, s * 0.8);
    g.lineBetween(s * 0.5, s * 0.35, s * 0.5, s * 0.82);
    g.lineBetween(s * 0.6, s * 0.35, s * 0.62, s * 0.8);
    g.lineBetween(s * 0.72, s * 0.35, s * 0.78, s * 0.75);
    g.generateTexture("jellyfish", s, s);
    g.destroy();
  }

  private createWaterCurrentTexture(s: number): void {
    const g = this.add.graphics();
    // Light blue translucent background
    g.fillStyle(0x4dc9f6, 0.3);
    g.fillRect(0, 0, s, s);
    // Arrow pointing right
    g.fillStyle(0x4dc9f6, 0.7);
    // Arrow shaft
    g.fillRect(s * 0.15, s * 0.4, s * 0.45, s * 0.2);
    // Arrow head (triangle)
    g.fillTriangle(s * 0.6, s * 0.25, s * 0.6, s * 0.75, s * 0.9, s * 0.5);
    g.generateTexture("water_current", s, s);
    g.destroy();
  }

  private createFogTexture(s: number): void {
    const g = this.add.graphics();
    // Semi-transparent dark green overlay
    g.fillStyle(0x1a4a3a, 0.75);
    g.fillRect(0, 0, s, s);
    // Seaweed lines
    g.lineStyle(1.5, 0x2d6b4e, 0.6);
    g.lineBetween(s * 0.2, s, s * 0.25, s * 0.3);
    g.lineBetween(s * 0.25, s * 0.3, s * 0.18, 0);
    g.lineBetween(s * 0.6, s, s * 0.55, s * 0.4);
    g.lineBetween(s * 0.55, s * 0.4, s * 0.62, s * 0.1);
    g.lineBetween(s * 0.85, s, s * 0.8, s * 0.5);
    g.lineBetween(s * 0.8, s * 0.5, s * 0.88, s * 0.15);
    g.generateTexture("fog", s, s);
    g.destroy();
  }

  private createColorTexture(
    key: string,
    width: number,
    height: number,
    color: number
  ): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  private createCircleTexture(
    key: string,
    size: number,
    color: number
  ): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillCircle(size / 2, size / 2, size / 2);
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }
}
