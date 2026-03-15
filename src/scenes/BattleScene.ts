import Phaser from "phaser";
import { AnimalType } from "../types";
import { sfx } from "../systems/SoundManager";

interface BattleSceneData {
  animalType: AnimalType;
  animalHp: number;
  attacksPerRound: number;
  timingBarSpeed: number;
  perfectZoneSize: number;
  parentScene: string;
  animalId: string;
  isBoss: boolean;
}

type BattlePhase = "player-attack" | "animal-attack" | "result";
type Direction = "up" | "down" | "left" | "right";

const ANIMAL_EMOJI: Record<AnimalType, string> = {
  snake: "🐍",
  monkey: "🐒",
  lizard: "🦎",
  leopard: "🐆",
  parrot: "🦜",
  crocodile: "🐊",
  spider: "🕷️",
};

const ANIMAL_NAME: Record<AnimalType, string> = {
  snake: "叢林毒蛇",
  monkey: "叢林猴子",
  lizard: "巨型蜥蜴",
  leopard: "叢林花豹",
  parrot: "暴怒鸚鵡",
  crocodile: "沼澤鱷魚",
  spider: "毒蜘蛛",
};

const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];
const DIR_ARROW: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};
const DIR_LABEL: Record<Direction, string> = {
  up: "上",
  down: "下",
  left: "左",
  right: "右",
};

export class BattleScene extends Phaser.Scene {
  private sceneData!: BattleSceneData;

  // HP state
  private playerHp = 3;
  private animalHp = 3;

  // Phase tracking
  private phase: BattlePhase = "player-attack";
  private locked = false;

  // Timing bar state
  private barX = 0;
  private barY = 0;
  private barWidth = 400;
  private barHeight = 40;
  private indicatorX = 0;
  private indicatorDir = 1;
  private barActive = false;

  // Display objects
  private playerHpText!: Phaser.GameObjects.Text;
  private animalHpText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private barGraphics!: Phaser.GameObjects.Graphics;
  private indicatorGraphics!: Phaser.GameObjects.Graphics;
  private attackBtn!: Phaser.GameObjects.Graphics;
  private attackBtnText!: Phaser.GameObjects.Text;
  private attackBtnZone!: Phaser.GameObjects.Zone;
  private dodgeBtns: Array<{
    bg: Phaser.GameObjects.Graphics;
    label: Phaser.GameObjects.Text;
    zone: Phaser.GameObjects.Zone;
    dir: Direction;
  }> = [];
  private dodgeContainer!: Phaser.GameObjects.Container;

  // Dodge phase state
  private currentAttackDirections: Direction[] = [];
  private dodgeIndex = 0;
  private dodgeTimer?: Phaser.Time.TimerEvent;
  private dodgeTimerBar!: Phaser.GameObjects.Graphics;
  private dodgeTimerStart = 0;
  private dodgeDuration = 2000;
  private dodgeSuccess = false;

  constructor() {
    super({ key: "BattleScene" });
  }

  init(data: BattleSceneData): void {
    this.sceneData = data;
    this.playerHp = 3;
    this.animalHp = data.animalHp;
    this.phase = "player-attack";
    this.locked = false;
    this.barActive = false;
    this.currentAttackDirections = [];
    this.dodgeIndex = 0;
    this.dodgeSuccess = false;
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Dark overlay
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.85);
    bg.fillRect(0, 0, width, height);

    // Panel
    const panelW = 600;
    const panelH = 500;
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x1a2a1a, 1);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 16);
    panel.lineStyle(3, 0x44aa44, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 16);

    // Animal display
    const isBoss = this.sceneData.isBoss;
    const animalEmoji = isBoss ? "🐯" : ANIMAL_EMOJI[this.sceneData.animalType];
    const animalName = isBoss ? "叢林虎王" : ANIMAL_NAME[this.sceneData.animalType];

    this.add
      .text(width / 2, panelY + 50, animalEmoji, {
        fontSize: "48px",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, panelY + 100, animalName, {
        fontSize: "22px",
        color: isBoss ? "#ffdd44" : "#ffaa44",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // HP displays
    this.animalHpText = this.add
      .text(width / 2, panelY + 130, this.buildHpString(this.animalHp, this.animalHp), {
        fontSize: "22px",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(panelX + 30, panelY + 180, "你的HP：", {
        fontSize: "18px",
        color: "#aaffaa",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);

    this.playerHpText = this.add
      .text(panelX + 130, panelY + 180, this.buildHpString(this.playerHp, 3), {
        fontSize: "22px",
        fontFamily: "Arial",
      })
      .setOrigin(0, 0.5);

    // Status label
    this.statusText = this.add
      .text(width / 2, panelY + 220, "你的回合 — 攻擊！", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Timing bar background area
    this.barX = (width - this.barWidth) / 2;
    this.barY = panelY + 270;

    this.barGraphics = this.add.graphics();
    this.indicatorGraphics = this.add.graphics();
    this.dodgeTimerBar = this.add.graphics();

    // Instruction text
    this.instructionText = this.add
      .text(width / 2, this.barY - 30, "按下「攻擊！」停住指示器", {
        fontSize: "16px",
        color: "#cccccc",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Feedback text
    this.feedbackText = this.add
      .text(width / 2, panelY + panelH - 60, "", {
        fontSize: "26px",
        color: "#ffff00",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Attack button
    this.attackBtn = this.add.graphics();
    this.attackBtnText = this.add.text(width / 2, this.barY + 70, "攻擊！", {
      fontSize: "24px",
      color: "#ffffff",
      fontFamily: "Arial",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.attackBtnZone = this.add
      .zone(width / 2, this.barY + 70, 160, 50)
      .setInteractive({ useHandCursor: true });

    this.attackBtnZone.on("pointerover", () => this.drawAttackBtn(true));
    this.attackBtnZone.on("pointerout", () => this.drawAttackBtn(false));
    this.attackBtnZone.on("pointerdown", () => this.onAttackPressed());

    // Dodge direction buttons (hidden initially)
    this.dodgeContainer = this.add.container(0, 0);
    this.createDodgeButtons();

    // Draw initial bar
    this.drawTimingBar();
    this.drawAttackBtn(false);

    // Start player attack phase
    this.startPlayerAttackPhase();
  }

  // ---------- UI builders ----------

  private buildHpString(current: number, max: number): string {
    let s = "";
    for (let i = 0; i < max; i++) {
      s += i < current ? "❤️" : "🖤";
    }
    return s;
  }

  private drawTimingBar(): void {
    this.barGraphics.clear();
    const bw = this.barWidth;
    const bh = this.barHeight;
    const bx = this.barX;
    const by = this.barY;
    const pz = this.sceneData.perfectZoneSize;

    // Bar background
    this.barGraphics.fillStyle(0x333333, 1);
    this.barGraphics.fillRect(bx, by, bw, bh);

    // Miss zone (full bar, red)
    this.barGraphics.fillStyle(0xcc2222, 1);
    this.barGraphics.fillRect(bx, by, bw, bh);

    // Hit zone (middle 40%, yellow)
    const hitFrac = 0.4;
    const hitW = bw * hitFrac;
    const hitX = bx + (bw - hitW) / 2;
    this.barGraphics.fillStyle(0xccaa00, 1);
    this.barGraphics.fillRect(hitX, by, hitW, bh);

    // Perfect zone (center, green)
    const perfectW = bw * pz;
    const perfectX = bx + (bw - perfectW) / 2;
    this.barGraphics.fillStyle(0x22cc44, 1);
    this.barGraphics.fillRect(perfectX, by, perfectW, bh);

    // Border
    this.barGraphics.lineStyle(2, 0xffffff, 0.6);
    this.barGraphics.strokeRect(bx, by, bw, bh);
  }

  private drawIndicator(): void {
    this.indicatorGraphics.clear();
    this.indicatorGraphics.fillStyle(0xffffff, 1);
    this.indicatorGraphics.fillRect(
      this.barX + this.indicatorX - 4,
      this.barY - 6,
      8,
      this.barHeight + 12
    );
  }

  private drawAttackBtn(hover: boolean): void {
    const { width } = this.cameras.main;
    this.attackBtn.clear();
    this.attackBtn.fillStyle(hover ? 0x228844 : 0x336633, 1);
    this.attackBtn.fillRoundedRect(width / 2 - 80, this.barY + 45, 160, 50, 10);
    this.attackBtn.lineStyle(2, 0x66ff66, 1);
    this.attackBtn.strokeRoundedRect(width / 2 - 80, this.barY + 45, 160, 50, 10);
  }

  private createDodgeButtons(): void {
    const { width, height } = this.cameras.main;
    const cx = width / 2;
    const cy = height / 2 + 80;
    const btnSize = 70;
    const gap = 80;

    const positions: Record<Direction, { x: number; y: number }> = {
      up:    { x: cx,        y: cy - gap },
      down:  { x: cx,        y: cy + gap },
      left:  { x: cx - gap,  y: cy },
      right: { x: cx + gap,  y: cy },
    };

    this.dodgeBtns = [];

    DIRECTIONS.forEach((dir) => {
      const pos = positions[dir];
      const bg = this.add.graphics();
      bg.fillStyle(0x335599, 1);
      bg.fillRoundedRect(pos.x - btnSize / 2, pos.y - btnSize / 2, btnSize, btnSize, 10);
      bg.lineStyle(2, 0x88aaff, 1);
      bg.strokeRoundedRect(pos.x - btnSize / 2, pos.y - btnSize / 2, btnSize, btnSize, 10);

      const label = this.add
        .text(pos.x, pos.y, `${DIR_ARROW[dir]}\n${DIR_LABEL[dir]}`, {
          fontSize: "20px",
          color: "#ffffff",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5);

      const zone = this.add
        .zone(pos.x, pos.y, btnSize, btnSize)
        .setInteractive({ useHandCursor: true });

      zone.on("pointerdown", () => this.onDodgePressed(dir));
      zone.on("pointerover", () => {
        bg.clear();
        bg.fillStyle(0x4477bb, 1);
        bg.fillRoundedRect(pos.x - btnSize / 2, pos.y - btnSize / 2, btnSize, btnSize, 10);
        bg.lineStyle(2, 0xaaccff, 1);
        bg.strokeRoundedRect(pos.x - btnSize / 2, pos.y - btnSize / 2, btnSize, btnSize, 10);
      });
      zone.on("pointerout", () => {
        bg.clear();
        bg.fillStyle(0x335599, 1);
        bg.fillRoundedRect(pos.x - btnSize / 2, pos.y - btnSize / 2, btnSize, btnSize, 10);
        bg.lineStyle(2, 0x88aaff, 1);
        bg.strokeRoundedRect(pos.x - btnSize / 2, pos.y - btnSize / 2, btnSize, btnSize, 10);
      });

      this.dodgeBtns.push({ bg, label, zone, dir });
    });

    this.setDodgeButtonsVisible(false);
  }

  private setDodgeButtonsVisible(visible: boolean): void {
    this.dodgeBtns.forEach(({ bg, label, zone }) => {
      bg.setVisible(visible);
      label.setVisible(visible);
      zone.setActive(visible);
      if (visible) {
        zone.setInteractive({ useHandCursor: true });
      } else {
        zone.disableInteractive();
      }
    });
  }

  private setAttackButtonVisible(visible: boolean): void {
    this.attackBtn.setVisible(visible);
    this.attackBtnText.setVisible(visible);
    this.attackBtnZone.setActive(visible);
    if (visible) {
      this.attackBtnZone.setInteractive({ useHandCursor: true });
    } else {
      this.attackBtnZone.disableInteractive();
    }
    this.barGraphics.setVisible(visible);
    this.indicatorGraphics.setVisible(visible);
  }

  // ---------- Phase controllers ----------

  private startPlayerAttackPhase(): void {
    this.phase = "player-attack";
    this.locked = false;
    this.indicatorX = 0;
    this.indicatorDir = 1;
    this.barActive = true;

    this.statusText.setText("你的回合 — 攻擊！");
    this.instructionText.setText("按下「攻擊！」停住指示器");
    this.feedbackText.setText("");

    this.setAttackButtonVisible(true);
    this.setDodgeButtonsVisible(false);
    this.dodgeTimerBar.clear();
    this.drawTimingBar();
  }

  private startAnimalAttackPhase(): void {
    this.phase = "animal-attack";
    this.locked = false;
    this.barActive = false;
    this.dodgeIndex = 0;
    this.dodgeSuccess = true;

    this.setAttackButtonVisible(false);

    // Generate attack directions
    const count = this.sceneData.attacksPerRound;
    this.currentAttackDirections = [];
    for (let i = 0; i < count; i++) {
      this.currentAttackDirections.push(
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
      );
    }

    this.statusText.setText("閃避！");
    this.feedbackText.setText("");
    this.instructionText.setText("");

    this.time.delayedCall(500, () => {
      this.showNextDodgePrompt();
    });
  }

  private showNextDodgePrompt(): void {
    if (this.dodgeIndex >= this.currentAttackDirections.length) {
      // All dodges done
      this.resolveDodgePhase();
      return;
    }

    const attackDir = this.currentAttackDirections[this.dodgeIndex];
    const dodgeDir = this.getOppositeDirection(attackDir);

    this.statusText.setText(
      `攻擊從【${DIR_LABEL[attackDir]}】方向來！按其他方向閃避！`
    );

    // Highlight the attack direction as danger
    this.dodgeBtns.forEach(({ bg, dir }) => {
      const pos = this.getDodgeBtnPos(dir);
      bg.clear();
      if (dir === attackDir) {
        bg.fillStyle(0xcc3333, 1);
        bg.fillRoundedRect(pos.x - 35, pos.y - 35, 70, 70, 10);
        bg.lineStyle(2, 0xff6666, 1);
        bg.strokeRoundedRect(pos.x - 35, pos.y - 35, 70, 70, 10);
      } else {
        bg.fillStyle(0x335599, 1);
        bg.fillRoundedRect(pos.x - 35, pos.y - 35, 70, 70, 10);
        bg.lineStyle(2, 0x88aaff, 1);
        bg.strokeRoundedRect(pos.x - 35, pos.y - 35, 70, 70, 10);
      }
    });

    this.setDodgeButtonsVisible(true);

    // Timer bar
    this.dodgeTimerStart = this.time.now;
    this.dodgeDuration = this.sceneData.isBoss ? 1500 : 2000;

    // Clear previous timer
    if (this.dodgeTimer) {
      this.dodgeTimer.destroy();
    }
    this.dodgeTimer = this.time.delayedCall(this.dodgeDuration, () => {
      // Time ran out — player failed to dodge
      this.onDodgeFailed();
    });

    void dodgeDir; // available but player can press any non-attack direction
  }

  private getOppositeDirection(dir: Direction): Direction {
    const opp: Record<Direction, Direction> = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    return opp[dir];
  }

  private getDodgeBtnPos(dir: Direction): { x: number; y: number } {
    const { width, height } = this.cameras.main;
    const cx = width / 2;
    const cy = height / 2 + 80;
    const gap = 80;
    const positions: Record<Direction, { x: number; y: number }> = {
      up:    { x: cx,       y: cy - gap },
      down:  { x: cx,       y: cy + gap },
      left:  { x: cx - gap, y: cy },
      right: { x: cx + gap, y: cy },
    };
    return positions[dir];
  }

  private onDodgePressed(pressedDir: Direction): void {
    if (this.locked) return;
    if (this.phase !== "animal-attack") return;

    const attackDir = this.currentAttackDirections[this.dodgeIndex];
    if (pressedDir === attackDir) {
      // Pressed the attack direction — fail
      this.onDodgeFailed();
      return;
    }

    // Successful dodge for this step
    if (this.dodgeTimer) this.dodgeTimer.destroy();
    sfx.barrierUnlock();

    this.feedbackText.setStyle({ color: "#44ff44" });
    this.feedbackText.setText("閃過了！");
    this.setDodgeButtonsVisible(false);

    this.dodgeIndex++;
    this.time.delayedCall(400, () => {
      this.feedbackText.setText("");
      this.showNextDodgePrompt();
    });
  }

  private onDodgeFailed(): void {
    if (this.dodgeTimer) this.dodgeTimer.destroy();
    this.dodgeSuccess = false;
    this.setDodgeButtonsVisible(false);
    this.dodgeTimerBar.clear();
    this.resolveDodgePhase();
  }

  private resolveDodgePhase(): void {
    this.setDodgeButtonsVisible(false);
    this.dodgeTimerBar.clear();

    if (this.dodgeSuccess) {
      sfx.barrierUnlock();
      this.feedbackText.setStyle({ color: "#44ff44" });
      this.feedbackText.setText("成功閃避！");
    } else {
      // Player takes damage
      sfx.trapHit();
      this.playerHp = Math.max(0, this.playerHp - 1);
      this.updateHpDisplays();
      this.feedbackText.setStyle({ color: "#ff4444" });
      this.feedbackText.setText("受到攻擊！");
    }

    this.time.delayedCall(800, () => {
      if (this.playerHp <= 0) {
        this.endBattle(false);
      } else {
        this.startPlayerAttackPhase();
      }
    });
  }

  // ---------- Attack bar ----------

  private onAttackPressed(): void {
    if (!this.barActive || this.locked) return;
    this.locked = true;
    this.barActive = false;

    const relPos = this.indicatorX / this.barWidth;
    const center = 0.5;
    const pz = this.sceneData.perfectZoneSize / 2;
    const hitFrac = 0.2; // half of 40% hit zone

    const distFromCenter = Math.abs(relPos - center);

    let damage = 0;
    let resultMsg = "";
    let resultColor = "#ffffff";

    if (distFromCenter <= pz) {
      damage = 2;
      resultMsg = "完美！傷害 ×2！";
      resultColor = "#44ff44";
      sfx.collectStar();
    } else if (distFromCenter <= hitFrac) {
      damage = 1;
      resultMsg = "命中！傷害 ×1";
      resultColor = "#ffff44";
      sfx.collectCoin();
    } else {
      damage = 0;
      resultMsg = "失誤！";
      resultColor = "#ff4444";
      sfx.wrongAnswer();
    }

    this.feedbackText.setStyle({ color: resultColor });
    this.feedbackText.setText(resultMsg);

    this.animalHp = Math.max(0, this.animalHp - damage);
    this.updateHpDisplays();

    this.time.delayedCall(800, () => {
      if (this.animalHp <= 0) {
        this.endBattle(true);
      } else {
        this.startAnimalAttackPhase();
      }
    });
  }

  private updateHpDisplays(): void {
    this.playerHpText.setText(this.buildHpString(this.playerHp, 3));
    this.animalHpText.setText(
      this.buildHpString(this.animalHp, this.sceneData.animalHp)
    );
  }

  // ---------- Battle end ----------

  private endBattle(won: boolean): void {
    this.phase = "result";
    this.locked = true;
    this.barActive = false;
    this.setAttackButtonVisible(false);
    this.setDodgeButtonsVisible(false);
    this.dodgeTimerBar.clear();
    this.indicatorGraphics.clear();
    this.barGraphics.clear();
    this.instructionText.setText("");

    const { width } = this.cameras.main;

    if (won) {
      sfx.battleWin();
      this.statusText.setText("🎉 勝利！");
      this.feedbackText.setStyle({ color: "#ffff44" });
      this.feedbackText.setText("擊敗了敵人！");
    } else {
      sfx.battleLose();
      this.statusText.setText("💀 戰敗！");
      this.feedbackText.setStyle({ color: "#ff4444" });
      this.feedbackText.setText("你被擊倒了……");
    }

    // Single result button — win: "繼續冒險", lose: "回到起點"
    const btnLabel = won ? "繼續冒險" : "回到起點";
    const btnColor = won ? 0x336633 : 0x663333;
    const btnBorder = won ? 0x66ff66 : 0xff6666;
    const btnY = this.barY + 20;

    const btn = this.add.graphics();
    btn.fillStyle(btnColor, 1);
    btn.fillRoundedRect(width / 2 - 90, btnY, 180, 50, 10);
    btn.lineStyle(2, btnBorder, 1);
    btn.strokeRoundedRect(width / 2 - 90, btnY, 180, 50, 10);

    this.add
      .text(width / 2, btnY + 25, btnLabel, {
        fontSize: "22px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .zone(width / 2, btnY + 25, 180, 50)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.closeBattle(won));
  }

  private closeBattle(won: boolean): void {
    const parentScene = this.scene.get(this.sceneData.parentScene);
    parentScene.events.emit("battle-result", {
      won,
      animalId: this.sceneData.animalId,
      isBoss: this.sceneData.isBoss,
    });
    this.scene.stop();
  }

  // ---------- Update loop ----------

  update(_time: number, delta: number): void {
    if (this.phase === "player-attack" && this.barActive && !this.locked) {
      const speed = this.sceneData.timingBarSpeed;
      this.indicatorX += (speed * delta) / 1000 * this.indicatorDir;

      if (this.indicatorX >= this.barWidth) {
        this.indicatorX = this.barWidth;
        this.indicatorDir = -1;
      } else if (this.indicatorX <= 0) {
        this.indicatorX = 0;
        this.indicatorDir = 1;
      }

      this.drawIndicator();
    }

    // Draw dodge timer bar
    if (this.phase === "animal-attack" && this.dodgeTimer && !this.dodgeTimer.hasDispatched) {
      const elapsed = this.time.now - this.dodgeTimerStart;
      const frac = Math.max(0, 1 - elapsed / this.dodgeDuration);
      const { width } = this.cameras.main;
      this.dodgeTimerBar.clear();
      this.dodgeTimerBar.fillStyle(0x222222, 0.7);
      this.dodgeTimerBar.fillRect(width / 2 - 150, 80, 300, 16);
      const color = frac > 0.5 ? 0x44ff44 : frac > 0.25 ? 0xffaa00 : 0xff3333;
      this.dodgeTimerBar.fillStyle(color, 1);
      this.dodgeTimerBar.fillRect(width / 2 - 150, 80, 300 * frac, 16);
      this.dodgeTimerBar.lineStyle(1, 0xffffff, 0.4);
      this.dodgeTimerBar.strokeRect(width / 2 - 150, 80, 300, 16);
    }
  }
}
