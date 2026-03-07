import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { ProfileSelectScene } from "./scenes/ProfileSelectScene";
import { TitleScene } from "./scenes/TitleScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { GameScene } from "./scenes/GameScene";
import { PuzzleScene } from "./scenes/PuzzleScene";
import { LevelCompleteScene } from "./scenes/LevelCompleteScene";
import { HowToPlayScene } from "./scenes/HowToPlayScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#1a1a2e",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    ProfileSelectScene,
    TitleScene,
    LevelSelectScene,
    GameScene,
    PuzzleScene,
    LevelCompleteScene,
    HowToPlayScene,
  ],
};

new Phaser.Game(config);
