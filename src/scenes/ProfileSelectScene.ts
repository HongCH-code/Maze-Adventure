import Phaser from "phaser";
import { profileManager, UserProfile } from "../systems/ProfileManager";
import { createMobileInput, removeMobileInput } from "../systems/MobileInput";

export class ProfileSelectScene extends Phaser.Scene {
  private isNaming = false;
  private namingSlot = -1;
  private inputName = "";
  private inputText?: Phaser.GameObjects.Text;
  private inputElements: Phaser.GameObjects.GameObject[] = [];
  private htmlInput: HTMLInputElement | null = null;

  constructor() {
    super({ key: "ProfileSelectScene" });
  }

  create(): void {
    this.isNaming = false;
    this.inputName = "";
    this.inputElements = [];
    this.htmlInput = null;

    const { width, height } = this.cameras.main;

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add
      .text(width / 2, 50, "選擇使用者", {
        fontSize: "36px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const profiles = profileManager.getProfiles();
    const cardW = 200;
    const cardH = 260;
    const gap = 30;
    const totalW = 3 * cardW + 2 * gap;
    const startX = (width - totalW) / 2;
    const cardY = (height - cardH) / 2 + 10;

    for (let i = 0; i < 3; i++) {
      const x = startX + i * (cardW + gap);
      this.drawSlot(x, cardY, cardW, cardH, i, profiles[i]);
    }
  }

  private drawSlot(
    x: number,
    y: number,
    w: number,
    h: number,
    slot: number,
    profile: UserProfile | null
  ): void {
    const cx = x + w / 2;

    if (profile) {
      // Filled slot
      const card = this.add.graphics();
      card.fillStyle(0x222244, 1);
      card.fillRoundedRect(x, y, w, h, 12);
      card.lineStyle(2, 0x4a90d9, 1);
      card.strokeRoundedRect(x, y, w, h, 12);

      // Avatar circle with slot number
      const avatarColors = [0x4a90d9, 0x33cc66, 0xff8844];
      this.add
        .graphics()
        .fillStyle(avatarColors[slot], 1)
        .fillCircle(cx, y + 55, 30);
      this.add
        .text(cx, y + 55, `P${slot + 1}`, {
          fontSize: "22px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Name
      this.add
        .text(cx, y + 105, profile.name, {
          fontSize: "22px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Progress info
      const completed = profileManager.getCompletedCount(slot);
      const highest = profileManager.getHighestLevel(slot);
      this.add
        .text(cx, y + 140, `已過 ${completed}/50 關`, {
          fontSize: "16px",
          color: "#aabbcc",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);
      this.add
        .text(cx, y + 162, `目前進度：第 ${highest} 關`, {
          fontSize: "14px",
          color: "#8899aa",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      // Select button
      const selectBtn = this.add
        .text(cx, y + 200, "選擇", {
          fontSize: "20px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          backgroundColor: "#4a90d9",
          padding: { x: 28, y: 8 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      selectBtn.on("pointerover", () =>
        selectBtn.setStyle({ backgroundColor: "#3a7bc8" })
      );
      selectBtn.on("pointerout", () =>
        selectBtn.setStyle({ backgroundColor: "#4a90d9" })
      );
      selectBtn.on("pointerdown", () => {
        profileManager.setActiveSlot(slot);
        this.scene.start("TitleScene");
      });

      // Delete button (small, bottom right)
      const delBtn = this.add
        .text(x + w - 10, y + h - 10, "刪除", {
          fontSize: "13px",
          color: "#cc5555",
          fontFamily: "Arial",
        })
        .setOrigin(1, 1)
        .setInteractive({ useHandCursor: true });
      delBtn.on("pointerover", () => delBtn.setColor("#ff6666"));
      delBtn.on("pointerout", () => delBtn.setColor("#cc5555"));
      delBtn.on("pointerdown", () => {
        profileManager.deleteProfile(slot);
        this.scene.restart();
      });
    } else {
      // Empty slot
      const card = this.add.graphics();
      card.fillStyle(0x1a1a2e, 1);
      card.fillRoundedRect(x, y, w, h, 12);
      card.lineStyle(2, 0x555577, 1);
      card.strokeRoundedRect(x, y, w, h, 12);

      // Dashed style placeholder
      this.add
        .text(cx, y + 70, "空位", {
          fontSize: "24px",
          color: "#555577",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      this.add
        .text(cx, y + 105, `玩家 ${slot + 1}`, {
          fontSize: "16px",
          color: "#444466",
          fontFamily: "Arial",
        })
        .setOrigin(0.5);

      // Create button
      const createBtn = this.add
        .text(cx, y + 170, "建立", {
          fontSize: "20px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          backgroundColor: "#333355",
          padding: { x: 28, y: 8 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      createBtn.on("pointerover", () =>
        createBtn.setStyle({ backgroundColor: "#444466" })
      );
      createBtn.on("pointerout", () =>
        createBtn.setStyle({ backgroundColor: "#333355" })
      );
      createBtn.on("pointerdown", () => {
        this.showNameInput(slot);
      });
    }
  }

  private showNameInput(slot: number): void {
    if (this.isNaming) return;
    this.isNaming = true;
    this.namingSlot = slot;
    this.inputName = "";

    const { width, height } = this.cameras.main;

    // Overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, width, height);
    this.inputElements.push(overlay);

    // Panel
    const panelW = 400;
    const panelH = 220;
    const px = (width - panelW) / 2;
    const py = (height - panelH) / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x222244, 1);
    panel.fillRoundedRect(px, py, panelW, panelH, 12);
    panel.lineStyle(2, 0x4a90d9, 1);
    panel.strokeRoundedRect(px, py, panelW, panelH, 12);
    this.inputElements.push(panel);

    this.inputElements.push(
      this.add
        .text(width / 2, py + 35, "輸入名字", {
          fontSize: "24px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
    );

    // Phaser display text (mirrors HTML input)
    const boxY = py + 75;
    const boxH = 44;
    this.inputText = this.add
      .text(width / 2, boxY + boxH / 2, "", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.inputElements.push(this.inputText);

    // HTML input for mobile keyboard support
    this.htmlInput = createMobileInput(
      (value) => {
        this.inputName = value;
        this.inputText?.setText(value);
      },
      () => this.confirmCreate()
    );

    // Confirm button
    const confirmBtn = this.add
      .text(width / 2 + 50, py + panelH - 45, "確認", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#4a90d9",
        padding: { x: 25, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    confirmBtn.on("pointerover", () =>
      confirmBtn.setStyle({ backgroundColor: "#3a7bc8" })
    );
    confirmBtn.on("pointerout", () =>
      confirmBtn.setStyle({ backgroundColor: "#4a90d9" })
    );
    confirmBtn.on("pointerdown", () => this.confirmCreate());
    this.inputElements.push(confirmBtn);

    // Cancel button
    const cancelBtn = this.add
      .text(width / 2 - 50, py + panelH - 45, "取消", {
        fontSize: "20px",
        color: "#aabbcc",
        fontFamily: "Arial",
        backgroundColor: "#333355",
        padding: { x: 25, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    cancelBtn.on("pointerover", () =>
      cancelBtn.setStyle({ backgroundColor: "#444466" })
    );
    cancelBtn.on("pointerout", () =>
      cancelBtn.setStyle({ backgroundColor: "#333355" })
    );
    cancelBtn.on("pointerdown", () => this.cancelCreate());
    this.inputElements.push(cancelBtn);
  }

  private confirmCreate(): void {
    if (!this.isNaming) return;
    const name = this.inputName.trim() || `玩家${this.namingSlot + 1}`;
    profileManager.createProfile(this.namingSlot, name);
    profileManager.setActiveSlot(this.namingSlot);
    this.cleanupInput();
    this.scene.start("TitleScene");
  }

  private cancelCreate(): void {
    this.cleanupInput();
    this.scene.restart();
  }

  private cleanupInput(): void {
    this.isNaming = false;
    removeMobileInput(this.htmlInput);
    this.htmlInput = null;
    this.inputElements.forEach((obj) => obj.destroy());
    this.inputElements = [];
    this.inputText = undefined;
  }
}
