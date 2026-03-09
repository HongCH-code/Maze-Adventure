import Phaser from "phaser";
import { ProgressManager } from "../systems/ProgressManager";

export const TOTAL_LEVELS = 65;
const COLS = 5;
const ROWS_PER_PAGE = 4;
const LEVELS_PER_PAGE = COLS * ROWS_PER_PAGE;
const BTN_SIZE = 64;
const BTN_GAP = 16;

export class LevelSelectScene extends Phaser.Scene {
  private progressManager!: ProgressManager;
  private currentPage = 0;
  private pageContainer?: Phaser.GameObjects.Container;
  private pageLabel?: Phaser.GameObjects.Text;
  private prevBtn?: Phaser.GameObjects.Text;
  private nextBtn?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "LevelSelectScene" });
  }

  create(): void {
    this.progressManager = new ProgressManager();
    const { width } = this.cameras.main;

    // Title
    this.add
      .text(width / 2, 40, "Select Level", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Back button
    const backBtn = this.add
      .text(30, 30, "< Back", {
        fontSize: "18px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerdown", () => this.scene.start("TitleScene"));

    // Page navigation
    const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

    this.prevBtn = this.add
      .text(width / 2 - 120, 560, "< Prev", {
        fontSize: "20px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.nextBtn = this.add
      .text(width / 2 + 120, 560, "Next >", {
        fontSize: "20px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.pageLabel = this.add
      .text(width / 2, 560, "", {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.prevBtn.on("pointerdown", () => {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.renderPage();
      }
    });

    this.nextBtn.on("pointerdown", () => {
      if (this.currentPage < totalPages - 1) {
        this.currentPage++;
        this.renderPage();
      }
    });

    this.renderPage();
  }

  private renderPage(): void {
    const { width, height } = this.cameras.main;
    const totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

    // Destroy previous page content
    if (this.pageContainer) {
      this.pageContainer.destroy();
    }

    this.pageContainer = this.add.container(0, 0);

    const startLevel = this.currentPage * LEVELS_PER_PAGE + 1;
    const endLevel = Math.min(startLevel + LEVELS_PER_PAGE - 1, TOTAL_LEVELS);
    const levelsOnPage = endLevel - startLevel + 1;

    const rows = Math.ceil(levelsOnPage / COLS);
    const gridWidth = COLS * BTN_SIZE + (COLS - 1) * BTN_GAP;
    const gridHeight = rows * BTN_SIZE + (rows - 1) * BTN_GAP;
    const startX = (width - gridWidth) / 2 + BTN_SIZE / 2;
    const startY = (height - gridHeight) / 2;

    for (let idx = 0; idx < levelsOnPage; idx++) {
      const level = startLevel + idx;
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x = startX + col * (BTN_SIZE + BTN_GAP);
      const y = startY + row * (BTN_SIZE + BTN_GAP);

      const unlocked = this.progressManager.isLevelUnlocked(level);
      const completed = this.progressManager.isLevelCompleted(level);

      // Button background
      const bgColor = completed ? 0x33cc66 : unlocked ? 0x4a90d9 : 0x555577;
      const bg = this.add.graphics();
      bg.fillStyle(bgColor, 1);
      bg.fillRoundedRect(
        x - BTN_SIZE / 2,
        y - BTN_SIZE / 2,
        BTN_SIZE,
        BTN_SIZE,
        8
      );
      this.pageContainer.add(bg);

      // Level number
      const label = this.add
        .text(x, y, `${level}`, {
          fontSize: "24px",
          color: unlocked ? "#ffffff" : "#888899",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.pageContainer.add(label);

      // Completed checkmark
      if (completed) {
        const check = this.add
          .text(x + BTN_SIZE / 2 - 10, y - BTN_SIZE / 2 + 4, "\u2713", {
            fontSize: "14px",
            color: "#ffffff",
            fontFamily: "Arial",
          })
          .setOrigin(0.5);
        this.pageContainer.add(check);
      }

      // Lock icon
      if (!unlocked) {
        const lock = this.add
          .text(x, y + 14, "\uD83D\uDD12", {
            fontSize: "12px",
          })
          .setOrigin(0.5);
        this.pageContainer.add(lock);
      }

      if (unlocked) {
        const zone = this.add
          .zone(x, y, BTN_SIZE, BTN_SIZE)
          .setInteractive({ useHandCursor: true });
        this.pageContainer.add(zone);

        const levelNum = level;
        zone.on("pointerdown", () => {
          this.scene.start("GameScene", { level: levelNum });
        });

        zone.on("pointerover", () => {
          bg.clear();
          bg.fillStyle(completed ? 0x28a856 : 0x3a7bc8, 1);
          bg.fillRoundedRect(
            x - BTN_SIZE / 2,
            y - BTN_SIZE / 2,
            BTN_SIZE,
            BTN_SIZE,
            8
          );
        });

        zone.on("pointerout", () => {
          bg.clear();
          bg.fillStyle(bgColor, 1);
          bg.fillRoundedRect(
            x - BTN_SIZE / 2,
            y - BTN_SIZE / 2,
            BTN_SIZE,
            BTN_SIZE,
            8
          );
        });
      }
    }

    // Update page label and button visibility
    this.pageLabel?.setText(`${this.currentPage + 1} / ${totalPages}`);
    this.prevBtn?.setAlpha(this.currentPage > 0 ? 1 : 0.3);
    this.nextBtn?.setAlpha(this.currentPage < totalPages - 1 ? 1 : 0.3);
  }
}
