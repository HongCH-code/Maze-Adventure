import Phaser from "phaser";
import { Direction } from "../types";

export class InputManager {
  private scene: Phaser.Scene;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private dpadButtons: Phaser.GameObjects.Container[] = [];
  private isTouchDevice: boolean;
  private onDirection: (dir: Direction) => void;
  private lastInputTime = 0;
  private inputCooldown = 150; // ms debounce
  private delayEvent?: Phaser.Time.TimerEvent;
  private repeatEvent?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, onDirection: (dir: Direction) => void) {
    this.scene = scene;
    this.onDirection = onDirection;
    this.isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    this.setupKeyboard();
    if (this.isTouchDevice) {
      this.setupDPad();
    }
  }

  private setupKeyboard(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
    }
  }

  private drawBtnBg(bg: Phaser.GameObjects.Graphics, size: number, alpha: number): void {
    bg.clear();
    bg.fillStyle(0xffffff, alpha);
    bg.fillRoundedRect(-size / 2, -size / 2, size, size, 8);
  }

  private setupDPad(): void {
    const { width, height } = this.scene.cameras.main;
    const btnSize = 56;
    const gap = 6;
    const centerX = width - 90;
    const centerY = height - 100;

    const directions: { dir: Direction; dx: number; dy: number }[] = [
      { dir: "up", dx: 0, dy: -(btnSize + gap) },
      { dir: "down", dx: 0, dy: btnSize + gap },
      { dir: "left", dx: -(btnSize + gap), dy: 0 },
      { dir: "right", dx: btnSize + gap, dy: 0 },
    ];

    for (const { dir, dx, dy } of directions) {
      const x = centerX + dx;
      const y = centerY + dy;

      const bg = this.scene.add.graphics();
      this.drawBtnBg(bg, btnSize, 0.25);

      // Draw arrow triangle with graphics for consistent look across devices
      const arrow = this.scene.add.graphics();
      const s = 10; // half-size of triangle
      arrow.fillStyle(0xffffff, 1);
      if (dir === "up") {
        arrow.fillTriangle(0, -s, -s, s, s, s);
      } else if (dir === "down") {
        arrow.fillTriangle(0, s, -s, -s, s, -s);
      } else if (dir === "left") {
        arrow.fillTriangle(-s, 0, s, -s, s, s);
      } else {
        arrow.fillTriangle(s, 0, -s, -s, -s, s);
      }

      const container = this.scene.add
        .container(x, y, [bg, arrow])
        .setScrollFactor(0)
        .setDepth(100)
        .setSize(btnSize, btnSize)
        .setInteractive();

      container.on("pointerdown", () => {
        this.drawBtnBg(bg, btnSize, 0.5);

        // Fire immediately
        this.onDirection(dir);

        // Stop any existing repeat
        this.stopRepeat();

        // After a delay, start repeating (auto-pauses/cleans up with scene)
        this.delayEvent = this.scene.time.delayedCall(400, () => {
          this.repeatEvent = this.scene.time.addEvent({
            delay: 120,
            loop: true,
            callback: () => this.onDirection(dir),
          });
        });
      });

      const stopHold = () => {
        this.stopRepeat();
        this.drawBtnBg(bg, btnSize, 0.25);
      };

      container.on("pointerup", stopHold);
      container.on("pointerout", stopHold);

      this.dpadButtons.push(container);
    }
  }

  update(): void {
    if (!this.cursors) return;

    const now = Date.now();
    if (now - this.lastInputTime < this.inputCooldown) return;

    if (this.cursors.up.isDown) {
      this.lastInputTime = now;
      this.onDirection("up");
    } else if (this.cursors.down.isDown) {
      this.lastInputTime = now;
      this.onDirection("down");
    } else if (this.cursors.left.isDown) {
      this.lastInputTime = now;
      this.onDirection("left");
    } else if (this.cursors.right.isDown) {
      this.lastInputTime = now;
      this.onDirection("right");
    }
  }

  private stopRepeat(): void {
    this.delayEvent?.remove();
    this.delayEvent = undefined;
    this.repeatEvent?.remove();
    this.repeatEvent = undefined;
  }

  destroy(): void {
    this.stopRepeat();
    for (const btn of this.dpadButtons) {
      btn.destroy();
    }
    this.dpadButtons = [];
  }
}
