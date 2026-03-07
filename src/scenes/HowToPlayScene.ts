import Phaser from "phaser";

export class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "HowToPlayScene" });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Panel background
    const panelW = 620;
    const panelH = 570;
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 1);
    bg.fillRect(0, 0, width, height);

    const panel = this.add.graphics();
    panel.fillStyle(0x222244, 1);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 16);
    panel.lineStyle(3, 0x4a90d9, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 16);

    // Title
    this.add
      .text(width / 2, panelY + 36, "遊戲說明", {
        fontSize: "32px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Rules with icons
    const rules = [
      { icon: "player", text: "用方向鍵或螢幕按鈕移動角色" },
      { icon: "star", text: "收集所有星星，終點旗子才會變綠色" },
      { icon: "exit", text: "走到綠色旗子即可過關" },
      { icon: "exit_locked", text: "紅色旗子 = 還沒收集完所有星星" },
      { icon: "key", text: "鑰匙可以解開路障" },
      { icon: "barrier_locked", text: "路障需要鑰匙才能通過" },
      { icon: "gate_locked", text: "答對數學題才能通過謎題門" },
      { icon: "coin", text: "金幣和星星是額外獎勵，盡量收集！" },
      { icon: "teleport", text: "傳送門會把你送到同顏色的另一個傳送門" },
      { icon: "trap", text: "陷阱會閃爍，亮起時踩到會回到起點！" },
    ];

    const startY = panelY + 80;
    const lineH = 40;
    const iconSize = 28;
    const textX = panelX + 70;

    for (let i = 0; i < rules.length; i++) {
      const y = startY + i * lineH;

      this.add
        .image(panelX + 40, y, rules[i].icon)
        .setDisplaySize(iconSize, iconSize);

      this.add.text(textX, y, rules[i].text, {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial",
      }).setOrigin(0, 0.5);
    }

    // Back button
    const backBtn = this.add
      .text(width / 2, panelY + panelH - 40, "返回", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#4a90d9",
        padding: { x: 40, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerover", () =>
      backBtn.setStyle({ backgroundColor: "#3a7bc8" })
    );
    backBtn.on("pointerout", () =>
      backBtn.setStyle({ backgroundColor: "#4a90d9" })
    );
    backBtn.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}
