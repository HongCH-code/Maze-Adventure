import Phaser from "phaser";
import { PuzzleGateData, Puzzle } from "../types";
import { PuzzleManager } from "../systems/PuzzleManager";
import { sfx } from "../systems/SoundManager";

interface PuzzleSceneData {
  gate: PuzzleGateData;
  cellKey: string;
  parentScene: string;
}

export class PuzzleScene extends Phaser.Scene {
  private sceneData!: PuzzleSceneData;
  private puzzleManager!: PuzzleManager;
  private puzzle!: Puzzle;
  private isAnswering = false;

  constructor() {
    super({ key: "PuzzleScene" });
  }

  init(data: PuzzleSceneData): void {
    this.sceneData = data;
    this.isAnswering = false;
  }

  create(): void {
    this.puzzleManager = new PuzzleManager();
    const { width, height } = this.cameras.main;
    const gate = this.sceneData.gate;

    // Generate puzzle
    this.puzzle = this.puzzleManager.generate(
      gate.puzzleType,
      gate.difficulty
    );

    // Dark overlay background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(0, 0, width, height);

    // Panel background
    const panelW = 500;
    const hasTextChoices = this.puzzle.choices.some(c => typeof c === "string" && `${c}`.length > 6);
    const panelH = hasTextChoices ? 420 : 380;
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x222244, 1);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 16);
    panel.lineStyle(3, 0x4a90d9, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 16);

    // Question text — use smaller font for counting puzzles with emoji grids or text-heavy puzzle types
    const isCounting = this.puzzle.puzzleType === "counting";
    const isTextPuzzle = ["zhuyinToChar", "imageToZhuyin", "lifeSafety", "oceanCreature"].includes(this.puzzle.puzzleType);
    const fontSize = isCounting || isTextPuzzle ? "26px" : "36px";
    this.add
      .text(width / 2, panelY + 60, this.puzzle.question, {
        fontSize,
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
        lineSpacing: isCounting ? 6 : 4,
        wordWrap: { width: panelW - 40 },
      })
      .setOrigin(0.5);

    // Answer buttons (2x2 grid)
    const btnW = 180;
    const btnH = hasTextChoices ? 75 : 60;
    const btnGap = 20;
    const gridStartX = width / 2 - btnW - btnGap / 2;
    const gridStartY = panelY + 160;

    this.puzzle.choices.forEach((choice, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const bx = gridStartX + col * (btnW + btnGap);
      const by = gridStartY + row * (btnH + btnGap);

      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x4a90d9, 1);
      btnBg.fillRoundedRect(bx, by, btnW, btnH, 10);

      // Use smaller font for text-based answers
      const isTextAnswer = typeof choice === "string";
      const choiceFontSize = isTextAnswer && `${choice}`.length > 4 ? "16px" : "28px";

      const btnText = this.add
        .text(bx + btnW / 2, by + btnH / 2, `${choice}`, {
          fontSize: choiceFontSize,
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: btnW - 16 },
        })
        .setOrigin(0.5);

      const zone = this.add
        .zone(bx + btnW / 2, by + btnH / 2, btnW, btnH)
        .setInteractive({ useHandCursor: true });

      zone.on("pointerover", () => {
        btnBg.clear();
        btnBg.fillStyle(0x3a7bc8, 1);
        btnBg.fillRoundedRect(bx, by, btnW, btnH, 10);
      });

      zone.on("pointerout", () => {
        btnBg.clear();
        btnBg.fillStyle(0x4a90d9, 1);
        btnBg.fillRoundedRect(bx, by, btnW, btnH, 10);
      });

      zone.on("pointerdown", () => {
        if (this.isAnswering) return;
        this.isAnswering = true;
        this.handleAnswer(choice, btnBg, btnText, bx, by, btnW, btnH);
      });
    });
  }

  private handleAnswer(
    choice: number | string,
    btnBg: Phaser.GameObjects.Graphics,
    btnText: Phaser.GameObjects.Text,
    bx: number,
    by: number,
    btnW: number,
    btnH: number
  ): void {
    if (choice === this.puzzle.correctAnswer) {
      // Correct answer
      sfx.correctAnswer();
      btnBg.clear();
      btnBg.fillStyle(0x33cc66, 1);
      btnBg.fillRoundedRect(bx, by, btnW, btnH, 10);

      const { width, height } = this.cameras.main;
      const correctText = this.add
        .text(width / 2, height / 2 - 120, "答對了！", {
          fontSize: "32px",
          color: "#33cc66",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setAlpha(0);

      this.tweens.add({
        targets: correctText,
        alpha: 1,
        y: height / 2 - 140,
        duration: 300,
        ease: "Power2",
      });

      this.time.delayedCall(800, () => {
        const parentScene = this.scene.get(this.sceneData.parentScene);
        parentScene.events.emit("gate-unlocked", this.sceneData.cellKey);
        this.scene.stop();
      });
    } else {
      // Incorrect answer — shake and retry
      sfx.wrongAnswer();
      btnBg.clear();
      btnBg.fillStyle(0xcc3333, 1);
      btnBg.fillRoundedRect(bx, by, btnW, btnH, 10);

      const { width, height } = this.cameras.main;
      const tryAgainText = this.add
        .text(width / 2, height / 2 - 120, "再試一次！", {
          fontSize: "28px",
          color: "#ffcc00",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: tryAgainText,
        alpha: 0,
        y: height / 2 - 140,
        duration: 800,
        delay: 400,
        ease: "Power2",
        onComplete: () => tryAgainText.destroy(),
      });

      // Reset button after delay
      this.time.delayedCall(600, () => {
        btnBg.clear();
        btnBg.fillStyle(0x4a90d9, 1);
        btnBg.fillRoundedRect(bx, by, btnW, btnH, 10);
        this.isAnswering = false;
      });
    }
  }
}
