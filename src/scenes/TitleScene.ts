import Phaser from "phaser";
import { profileManager } from "../systems/ProfileManager";
import { TOTAL_LEVELS } from "./LevelSelectScene";
import { music } from "../systems/MusicManager";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScene" });
  }

  create(): void {
    const { width, height } = this.cameras.main;
    const profile = profileManager.getActiveProfile();

    // Menu background music
    music.play("bgm_menu");

    // Title
    this.add
      .text(width / 2, height * 0.2, "迷宮大冒險", {
        fontSize: "48px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, height * 0.2 + 55, "Maze Adventure", {
        fontSize: "20px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Current user display
    if (profile) {
      const slot = profileManager.getActiveSlot()!;
      const completed = profileManager.getCompletedCount(slot);
      this.add
        .text(width / 2, height * 0.38, `${profile.name}　(${completed}/${TOTAL_LEVELS} 關)`, {
          fontSize: "18px",
          color: "#ffcc00",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
    }

    // Play button
    const playBtn = this.add
      .text(width / 2, height * 0.5, "開始遊戲", {
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
      .text(width / 2, height * 0.64, "遊戲說明", {
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

    // Switch user button
    const switchBtn = this.add
      .text(width / 2, height * 0.78, "切換使用者", {
        fontSize: "20px",
        color: "#8899aa",
        fontFamily: "Arial",
        backgroundColor: "#2a2a44",
        padding: { x: 25, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    switchBtn.on("pointerover", () =>
      switchBtn.setStyle({ backgroundColor: "#333355" })
    );
    switchBtn.on("pointerout", () =>
      switchBtn.setStyle({ backgroundColor: "#2a2a44" })
    );
    switchBtn.on("pointerdown", () => {
      this.scene.start("ProfileSelectScene");
    });
  }
}
