import Phaser from "phaser";
import {
  LeaderboardManager,
  LeaderboardEntry,
} from "../systems/LeaderboardManager";
import { createMobileInput, removeMobileInput } from "../systems/MobileInput";
import { music } from "../systems/MusicManager";
import { TOTAL_LEVELS } from "./LevelSelectScene";

interface LevelCompleteData {
  level: number;
  timeSeconds: number;
  starsCollected: number;
  totalStars: number;
  coinsCollected: number;
  totalCoins: number;
}

export class LevelCompleteScene extends Phaser.Scene {
  private levelResult!: LevelCompleteData;
  private lb!: LeaderboardManager;
  private playerName = "";
  private nameText?: Phaser.GameObjects.Text;
  private nameInputActive = false;
  private overlayElements: Phaser.GameObjects.GameObject[] = [];
  private newEntryRank = -1;
  private htmlInput: HTMLInputElement | null = null;

  constructor() {
    super({ key: "LevelCompleteScene" });
  }

  init(data: LevelCompleteData): void {
    this.levelResult = data;
    this.playerName = "";
    this.nameInputActive = false;
    this.overlayElements = [];
    this.newEntryRank = -1;
    this.htmlInput = null;
  }

  create(): void {
    music.play("bgm_menu");
    this.lb = new LeaderboardManager();
    const d = this.levelResult;

    // Clean up HTML input when scene shuts down
    this.events.once("shutdown", () => {
      removeMobileInput(this.htmlInput);
      this.htmlInput = null;
    });

    if (this.lb.qualifies(d.level, d.timeSeconds, d.coinsCollected)) {
      this.showNameInput();
    } else {
      this.showResults();
    }
  }

  /* ---------- Name input screen ---------- */
  private showNameInput(): void {
    const { width, height } = this.cameras.main;
    const d = this.levelResult;
    this.nameInputActive = true;

    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 1);
    bg.fillRect(0, 0, width, height);
    this.overlayElements.push(bg);

    this.overlayElements.push(
      this.add
        .text(width / 2, height * 0.18, "恭喜進入排行榜！", {
          fontSize: "34px",
          color: "#ffcc00",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    const minutes = Math.floor(d.timeSeconds / 60);
    const seconds = d.timeSeconds % 60;
    const timeStr = `${minutes > 0 ? `${minutes}分 ` : ""}${seconds}秒`;
    this.overlayElements.push(
      this.add
        .text(
          width / 2,
          height * 0.30,
          `完成時間：${timeStr}　金幣：${d.coinsCollected}`,
          { fontSize: "20px", color: "#ffffff", fontFamily: "Arial" }
        )
        .setOrigin(0.5)
    );

    this.overlayElements.push(
      this.add
        .text(width / 2, height * 0.44, "請輸入你的名字：", {
          fontSize: "22px",
          color: "#aabbcc",
          fontFamily: "Arial",
        })
        .setOrigin(0.5)
    );

    // Input center position in game coordinates
    const boxY = height * 0.52;
    const boxH = 50;
    const inputCenterX = width / 2;
    const inputCenterY = boxY + boxH / 2;

    // Phaser display text (mirrors HTML input)
    this.nameText = this.add
      .text(inputCenterX, inputCenterY, "", {
        fontSize: "26px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.overlayElements.push(this.nameText);

    // HTML input for mobile keyboard support — positioned over game coordinates
    this.htmlInput = createMobileInput(
      this,
      inputCenterX,
      inputCenterY,
      (value) => {
        this.playerName = value;
        this.nameText?.setText(value);
      },
      () => this.confirmName()
    );

    // Confirm button
    const confirmBtn = this.add
      .text(width / 2, height * 0.72, "確認", {
        fontSize: "26px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#4a90d9",
        padding: { x: 40, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    confirmBtn.on("pointerover", () =>
      confirmBtn.setStyle({ backgroundColor: "#3a7bc8" })
    );
    confirmBtn.on("pointerout", () =>
      confirmBtn.setStyle({ backgroundColor: "#4a90d9" })
    );
    confirmBtn.on("pointerdown", () => this.confirmName());
    this.overlayElements.push(confirmBtn);
  }

  private confirmName(): void {
    if (!this.nameInputActive) return;
    const name = this.playerName.trim() || "玩家";
    this.nameInputActive = false;

    removeMobileInput(this.htmlInput);
    this.htmlInput = null;

    const d = this.levelResult;
    this.newEntryRank = this.lb.addEntry(
      d.level,
      name,
      d.timeSeconds,
      d.coinsCollected
    );

    this.overlayElements.forEach((obj) => obj.destroy());
    this.overlayElements = [];
    this.nameText = undefined;

    this.showResults();
  }

  /* ---------- Results + leaderboard screen ---------- */
  private showResults(): void {
    const { width, height } = this.cameras.main;
    const d = this.levelResult;

    // Title
    this.add
      .text(width / 2, height * 0.06, "過關！", {
        fontSize: "34px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Stats line
    const minutes = Math.floor(d.timeSeconds / 60);
    const seconds = d.timeSeconds % 60;
    const parts: string[] = [`第 ${d.level} 關`];
    parts.push(
      `時間：${minutes > 0 ? `${minutes}分 ` : ""}${seconds}秒`
    );
    if (d.totalStars > 0)
      parts.push(`星星：${d.starsCollected}/${d.totalStars}`);
    if (d.totalCoins > 0)
      parts.push(`金幣：${d.coinsCollected}/${d.totalCoins}`);

    this.add
      .text(width / 2, height * 0.15, parts.join("  "), {
        fontSize: "15px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Leaderboard header
    this.add
      .text(width / 2, height * 0.25, "排行榜", {
        fontSize: "22px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const entries: LeaderboardEntry[] = this.lb.getLeaderboard(d.level);
    const startY = height * 0.34;
    const lineH = 30;
    const col = {
      rank: width * 0.14,
      name: width * 0.26,
      time: width * 0.58,
      coins: width * 0.78,
    };

    // Column headers
    const headerStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "13px",
      color: "#8899aa",
      fontFamily: "Arial",
    };
    this.add.text(col.rank, startY - lineH, "名次", headerStyle);
    this.add.text(col.name, startY - lineH, "名字", headerStyle);
    this.add.text(col.time, startY - lineH, "時間", headerStyle);
    this.add.text(col.coins, startY - lineH, "金幣", headerStyle);

    for (let i = 0; i < 5; i++) {
      const y = startY + i * lineH;
      const isNew = this.newEntryRank === i + 1;
      const color = isNew ? "#ffcc00" : "#ffffff";
      const emptyColor = "#555577";
      const style: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: "17px",
        color,
        fontFamily: "Arial",
        fontStyle: isNew ? "bold" : "normal",
      };

      if (entries[i]) {
        const e = entries[i];
        const m = Math.floor(e.timeSeconds / 60);
        const s = e.timeSeconds % 60;
        const t = m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}秒`;

        this.add.text(col.rank, y, `${i + 1}.`, style);
        this.add.text(col.name, y, e.name, style);
        this.add.text(col.time, y, t, style);
        this.add.text(col.coins, y, `${e.coins}`, style);
      } else {
        this.add.text(col.rank, y, `${i + 1}.`, {
          ...style,
          color: emptyColor,
        });
        this.add.text(col.name, y, "---", { ...style, color: emptyColor });
      }
    }

    // Navigation buttons
    if (d.level < TOTAL_LEVELS) {
      const nextBtn = this.add
        .text(width / 2, height * 0.78, "下一關", {
          fontSize: "24px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          backgroundColor: "#4a90d9",
          padding: { x: 30, y: 10 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      nextBtn.on("pointerover", () =>
        nextBtn.setStyle({ backgroundColor: "#3a7bc8" })
      );
      nextBtn.on("pointerout", () =>
        nextBtn.setStyle({ backgroundColor: "#4a90d9" })
      );
      nextBtn.on("pointerdown", () =>
        this.scene.start("GameScene", { level: d.level + 1 })
      );
    } else {
      this.add
        .text(width / 2, height * 0.78, "全部通關！", {
          fontSize: "24px",
          color: "#ffcc00",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
    }

    const menuBtn = this.add
      .text(width / 2, height * 0.90, "選擇關卡", {
        fontSize: "20px",
        color: "#aabbcc",
        fontFamily: "Arial",
        backgroundColor: "#333355",
        padding: { x: 25, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    menuBtn.on("pointerover", () =>
      menuBtn.setStyle({ backgroundColor: "#444466" })
    );
    menuBtn.on("pointerout", () =>
      menuBtn.setStyle({ backgroundColor: "#333355" })
    );
    menuBtn.on("pointerdown", () =>
      this.scene.start("LevelSelectScene")
    );
  }
}
