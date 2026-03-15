import Phaser from "phaser";

interface RuleLine {
  icon: string | null;
  text: string;
  color?: string;
}

interface PageData {
  title: string;
  titleColor: string;
  rules: RuleLine[];
}

const PAGES: PageData[] = [
  {
    title: "基本操作",
    titleColor: "#ffcc00",
    rules: [
      { icon: "player", text: "用方向鍵或螢幕按鈕移動角色" },
      { icon: "star", text: "收集所有星星，終點旗子才會變綠色" },
      { icon: "exit", text: "走到綠色旗子即可過關" },
      { icon: "exit_locked", text: "紅色旗子 = 還沒收集完所有星星" },
      { icon: "key", text: "鑰匙可以解開路障" },
      { icon: "barrier_locked", text: "路障需要鑰匙才能通過" },
      { icon: "gate_locked", text: "答對題目才能通過謎題門" },
      { icon: "coin", text: "金幣和星星是額外獎勵，盡量收集！" },
      { icon: "teleport", text: "傳送門會把你送到同顏色的另一個傳送門" },
      { icon: "trap", text: "陷阱會閃爍，亮起時踩到會回到起點！" },
    ],
  },
  {
    title: "🌊 海洋世界（第 51-65 關）",
    titleColor: "#44aaff",
    rules: [
      { icon: null, text: "進入海底世界，所有物品都變成海洋生物！", color: "#88ccff" },
      { icon: "starfish", text: "海星 = 星星，收集所有海星才能過關" },
      { icon: "pearl", text: "珍珠 = 金幣，額外獎勵" },
      { icon: "shell", text: "貝殼 = 鑰匙，用來解開路障" },
      { icon: "whirlpool", text: "漩渦 = 傳送門，同顏色互相傳送" },
      { icon: "jellyfish", text: "水母 = 陷阱，碰到會回到起點" },
      { icon: "water_current", text: "水流會把你推向箭頭方向（逆流可抵抗）" },
      { icon: "fog", text: "海底迷霧會遮住視線，靠近才會消散" },
      { icon: null, text: "新增題型：海洋生物辨識、生活安全知識", color: "#aaddff" },
      { icon: null, text: "新增題型：看時鐘、硬幣計算", color: "#aaddff" },
    ],
  },
  {
    title: "🌴 叢林冒險（第 66-80 關）",
    titleColor: "#44ff66",
    rules: [
      { icon: null, text: "深入叢林探險，全新機制等你挑戰！", color: "#88ffaa" },
      { icon: "gem", text: "寶石 = 星星，收集所有寶石才能過關" },
      { icon: "fruit", text: "水果 = 金幣，額外獎勵" },
      { icon: "totem", text: "圖騰碎片 = 鑰匙，用來解開路障" },
      { icon: "tree_hole", text: "樹洞 = 傳送門，同顏色互相傳送" },
      { icon: "jungle_trap", text: "荊棘 = 陷阱，碰到會回到起點" },
      { icon: "vine_bridge", text: "藤蔓橋可通行 5 次，之後會崩塌！" },
      { icon: "patrol_animal", text: "巡邏動物碰到會進入戰鬥模式" },
      { icon: null, text: "戰鬥：攻擊用時機條，防禦用方向閃避", color: "#ffdd44" },
      { icon: null, text: "第 80 關 Boss「叢林虎王」守在終點！", color: "#ff6644" },
    ],
  },
];

export class HowToPlayScene extends Phaser.Scene {
  private currentPage = 0;
  private pageContainer?: Phaser.GameObjects.Container;
  private pageLabel?: Phaser.GameObjects.Text;
  private prevBtn?: Phaser.GameObjects.Text;
  private nextBtn?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "HowToPlayScene" });
  }

  create(): void {
    this.currentPage = 0;
    const { width, height } = this.cameras.main;

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 1);
    bg.fillRect(0, 0, width, height);

    // Page navigation
    this.prevBtn = this.add
      .text(width / 2 - 140, height - 45, "< 上一頁", {
        fontSize: "18px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.nextBtn = this.add
      .text(width / 2 + 140, height - 45, "下一頁 >", {
        fontSize: "18px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.pageLabel = this.add
      .text(width / 2, height - 45, "", {
        fontSize: "16px",
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
      if (this.currentPage < PAGES.length - 1) {
        this.currentPage++;
        this.renderPage();
      }
    });

    // Back button
    const backBtn = this.add
      .text(30, 20, "< 返回", {
        fontSize: "18px",
        color: "#aabbcc",
        fontFamily: "Arial",
      })
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });

    this.renderPage();
  }

  private renderPage(): void {
    const { width, height } = this.cameras.main;

    if (this.pageContainer) {
      this.pageContainer.destroy();
    }
    this.pageContainer = this.add.container(0, 0);

    const page = PAGES[this.currentPage];

    // Panel
    const panelW = 620;
    const panelH = 500;
    const panelX = (width - panelW) / 2;
    const panelY = 50;

    const panel = this.add.graphics();
    panel.fillStyle(0x222244, 1);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 16);
    panel.lineStyle(3, 0x4a90d9, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 16);
    this.pageContainer.add(panel);

    // Title
    const title = this.add
      .text(width / 2, panelY + 36, page.title, {
        fontSize: "28px",
        color: page.titleColor,
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.pageContainer.add(title);

    // Rules
    const startY = panelY + 80;
    const lineH = 42;
    const iconSize = 28;
    const textX = panelX + 70;

    for (let i = 0; i < page.rules.length; i++) {
      const rule = page.rules[i];
      const y = startY + i * lineH;

      if (rule.icon) {
        const icon = this.add
          .image(panelX + 40, y, rule.icon)
          .setDisplaySize(iconSize, iconSize);
        this.pageContainer.add(icon);
      } else {
        // Bullet point for text-only lines
        const bullet = this.add
          .text(panelX + 40, y, "▸", {
            fontSize: "18px",
            color: rule.color || "#ffffff",
            fontFamily: "Arial",
          })
          .setOrigin(0.5);
        this.pageContainer.add(bullet);
      }

      const text = this.add.text(textX, y, rule.text, {
        fontSize: "17px",
        color: rule.color || "#ffffff",
        fontFamily: "Arial",
      }).setOrigin(0, 0.5);
      this.pageContainer.add(text);
    }

    // Update nav
    this.pageLabel?.setText(`${this.currentPage + 1} / ${PAGES.length}`);
    this.prevBtn?.setAlpha(this.currentPage > 0 ? 1 : 0.3);
    this.nextBtn?.setAlpha(this.currentPage < PAGES.length - 1 ? 1 : 0.3);
  }
}
