import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScene" });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Title
    this.add
      .text(width / 2, height * 0.25, "迷宮大冒險", {
        fontSize: "48px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, height * 0.25 + 55, "Maze Adventure", {
        fontSize: "20px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Play button
    const playBtn = this.add
      .text(width / 2, height * 0.55, "開始遊戲", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#4a90d9",
        padding: { x: 40, y: 15 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playBtn.on("pointerover", () =>
      playBtn.setStyle({ backgroundColor: "#3a7bc8" })
    );
    playBtn.on("pointerout", () =>
      playBtn.setStyle({ backgroundColor: "#4a90d9" })
    );
    playBtn.on("pointerdown", () => {
      this.scene.start("LevelSelectScene");
    });

    // How to Play button
    const helpBtn = this.add
      .text(width / 2, height * 0.72, "遊戲說明", {
        fontSize: "24px",
        color: "#aabbcc",
        fontFamily: "Arial",
        backgroundColor: "#333355",
        padding: { x: 30, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    helpBtn.on("pointerover", () =>
      helpBtn.setStyle({ backgroundColor: "#444466" })
    );
    helpBtn.on("pointerout", () =>
      helpBtn.setStyle({ backgroundColor: "#333355" })
    );
    helpBtn.on("pointerdown", () => {
      this.scene.start("HowToPlayScene");
    });
  }
}
