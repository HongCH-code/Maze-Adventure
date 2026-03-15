import { TOTAL_LEVELS } from "./LevelSelectScene";
import Phaser from "phaser";
import { MazeGenerator } from "../systems/MazeGenerator";
import { sfx } from "../systems/SoundManager";
import { music } from "../systems/MusicManager";
import { ProgressManager } from "../systems/ProgressManager";
import { InputManager } from "../systems/InputManager";
import {
  LevelData,
  MazeCell,
  Position,
  Direction,
  ItemPlacementData,
  TeleportPairData,
  TrapData,
  WaterCurrentData,
  FogZoneData,
  VineBridgeData,
  PatrolAnimalData,
  AnimalType,
} from "../types";

// Import all level JSONs statically for Vite bundling
import level01 from "../data/levels/level-01.json";
import level02 from "../data/levels/level-02.json";
import level03 from "../data/levels/level-03.json";
import level04 from "../data/levels/level-04.json";
import level05 from "../data/levels/level-05.json";
import level06 from "../data/levels/level-06.json";
import level07 from "../data/levels/level-07.json";
import level08 from "../data/levels/level-08.json";
import level09 from "../data/levels/level-09.json";
import level10 from "../data/levels/level-10.json";
import level11 from "../data/levels/level-11.json";
import level12 from "../data/levels/level-12.json";
import level13 from "../data/levels/level-13.json";
import level14 from "../data/levels/level-14.json";
import level15 from "../data/levels/level-15.json";
import level16 from "../data/levels/level-16.json";
import level17 from "../data/levels/level-17.json";
import level18 from "../data/levels/level-18.json";
import level19 from "../data/levels/level-19.json";
import level20 from "../data/levels/level-20.json";
import level21 from "../data/levels/level-21.json";
import level22 from "../data/levels/level-22.json";
import level23 from "../data/levels/level-23.json";
import level24 from "../data/levels/level-24.json";
import level25 from "../data/levels/level-25.json";
import level26 from "../data/levels/level-26.json";
import level27 from "../data/levels/level-27.json";
import level28 from "../data/levels/level-28.json";
import level29 from "../data/levels/level-29.json";
import level30 from "../data/levels/level-30.json";
import level31 from "../data/levels/level-31.json";
import level32 from "../data/levels/level-32.json";
import level33 from "../data/levels/level-33.json";
import level34 from "../data/levels/level-34.json";
import level35 from "../data/levels/level-35.json";
import level36 from "../data/levels/level-36.json";
import level37 from "../data/levels/level-37.json";
import level38 from "../data/levels/level-38.json";
import level39 from "../data/levels/level-39.json";
import level40 from "../data/levels/level-40.json";
import level41 from "../data/levels/level-41.json";
import level42 from "../data/levels/level-42.json";
import level43 from "../data/levels/level-43.json";
import level44 from "../data/levels/level-44.json";
import level45 from "../data/levels/level-45.json";
import level46 from "../data/levels/level-46.json";
import level47 from "../data/levels/level-47.json";
import level48 from "../data/levels/level-48.json";
import level49 from "../data/levels/level-49.json";
import level50 from "../data/levels/level-50.json";
import level51 from "../data/levels/level-51.json";
import level52 from "../data/levels/level-52.json";
import level53 from "../data/levels/level-53.json";
import level54 from "../data/levels/level-54.json";
import level55 from "../data/levels/level-55.json";
import level56 from "../data/levels/level-56.json";
import level57 from "../data/levels/level-57.json";
import level58 from "../data/levels/level-58.json";
import level59 from "../data/levels/level-59.json";
import level60 from "../data/levels/level-60.json";
import level61 from "../data/levels/level-61.json";
import level62 from "../data/levels/level-62.json";
import level63 from "../data/levels/level-63.json";
import level64 from "../data/levels/level-64.json";
import level65 from "../data/levels/level-65.json";
import level66 from "../data/levels/level-66.json";
import level67 from "../data/levels/level-67.json";
import level68 from "../data/levels/level-68.json";
import level69 from "../data/levels/level-69.json";
import level70 from "../data/levels/level-70.json";
import level71 from "../data/levels/level-71.json";
import level72 from "../data/levels/level-72.json";
import level73 from "../data/levels/level-73.json";
import level74 from "../data/levels/level-74.json";
import level75 from "../data/levels/level-75.json";
import level76 from "../data/levels/level-76.json";
import level77 from "../data/levels/level-77.json";
import level78 from "../data/levels/level-78.json";
import level79 from "../data/levels/level-79.json";
import level80 from "../data/levels/level-80.json";

const LEVEL_MAP: Record<number, LevelData> = {
  1: level01 as LevelData,
  2: level02 as LevelData,
  3: level03 as LevelData,
  4: level04 as LevelData,
  5: level05 as LevelData,
  6: level06 as LevelData,
  7: level07 as LevelData,
  8: level08 as LevelData,
  9: level09 as LevelData,
  10: level10 as LevelData,
  11: level11 as LevelData,
  12: level12 as LevelData,
  13: level13 as LevelData,
  14: level14 as LevelData,
  15: level15 as LevelData,
  16: level16 as LevelData,
  17: level17 as LevelData,
  18: level18 as LevelData,
  19: level19 as LevelData,
  20: level20 as LevelData,
  21: level21 as LevelData,
  22: level22 as LevelData,
  23: level23 as LevelData,
  24: level24 as LevelData,
  25: level25 as LevelData,
  26: level26 as LevelData,
  27: level27 as LevelData,
  28: level28 as LevelData,
  29: level29 as LevelData,
  30: level30 as LevelData,
  31: level31 as LevelData,
  32: level32 as LevelData,
  33: level33 as LevelData,
  34: level34 as LevelData,
  35: level35 as LevelData,
  36: level36 as LevelData,
  37: level37 as LevelData,
  38: level38 as LevelData,
  39: level39 as LevelData,
  40: level40 as LevelData,
  41: level41 as LevelData,
  42: level42 as LevelData,
  43: level43 as LevelData,
  44: level44 as LevelData,
  45: level45 as LevelData,
  46: level46 as LevelData,
  47: level47 as LevelData,
  48: level48 as LevelData,
  49: level49 as LevelData,
  50: level50 as LevelData,
  51: level51 as LevelData,
  52: level52 as LevelData,
  53: level53 as LevelData,
  54: level54 as LevelData,
  55: level55 as LevelData,
  56: level56 as LevelData,
  57: level57 as LevelData,
  58: level58 as LevelData,
  59: level59 as LevelData,
  60: level60 as LevelData,
  61: level61 as LevelData,
  62: level62 as LevelData,
  63: level63 as LevelData,
  64: level64 as LevelData,
  65: level65 as LevelData,
  66: level66 as LevelData,
  67: level67 as LevelData,
  68: level68 as LevelData,
  69: level69 as LevelData,
  70: level70 as LevelData,
  71: level71 as LevelData,
  72: level72 as LevelData,
  73: level73 as LevelData,
  74: level74 as LevelData,
  75: level75 as LevelData,
  76: level76 as LevelData,
  77: level77 as LevelData,
  78: level78 as LevelData,
  79: level79 as LevelData,
  80: level80 as LevelData,
};

const TILE_SIZE = 32;

interface PlacedItem {
  gridPos: Position;
  data: ItemPlacementData;
}

export class GameScene extends Phaser.Scene {
  private levelData!: LevelData;
  private grid!: MazeCell[][];
  private player!: Phaser.GameObjects.Image;
  private playerPos!: Position;
  private isMoving = false;
  private inputManager!: InputManager;
  private progressManager!: ProgressManager;
  private startTime = 0;
  private isPaused = false;
  private pauseOverlay?: Phaser.GameObjects.GameObject[];
  private offsetX = 0;
  private offsetY = 0;

  // Item tracking
  private itemSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private placedItems: Map<string, PlacedItem> = new Map();
  private collectedItems = { stars: 0, coins: 0, keys: 0 };
  private totalItems = { stars: 0, coins: 0 };
  private hudText?: Phaser.GameObjects.Text;

  // Gate tracking (puzzle gates)
  private gateSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private unlockedGates: Set<string> = new Set();
  private gateCellToData: Map<string, LevelData["puzzleGates"][0]> = new Map();

  // Barrier tracking (key-locked barriers — any key opens any barrier)
  private barrierSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private unlockedBarriers: Set<string> = new Set();

  // Exit tracking (locked until all stars collected)
  private exitPos!: Position;
  private exitSprite?: Phaser.GameObjects.Image;
  private exitLocked = false;

  // Teleport tracking
  private teleportSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private teleportMap: Map<string, Position> = new Map();

  // Trap tracking
  private trapSprites: Map<
    string,
    { sprite: Phaser.GameObjects.Image; group: number }
  > = new Map();
  private trapPhase = 0; // which group is currently dangerous
  private startGridPos: Position = { x: 1, y: 1 };

  // Water current tracking
  private currentSprites: Map<string, { sprite: Phaser.GameObjects.Image; direction: Direction; strength: number }> = new Map();
  private lastMoveDirection: Direction = "right";

  // Fog tracking
  private fogSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private revealedFog: Set<string> = new Set();

  // Vine bridge tracking (5 uses before collapse)
  private vineBridgeSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private vineBridgeUses: Map<string, number> = new Map();
  private static readonly MAX_BRIDGE_USES = 5;

  // Patrol animal tracking
  private patrolAnimalSprites: Map<string, {
    sprite: Phaser.GameObjects.Image;
    data: PatrolAnimalData;
    currentWaypoint: number;
    gridPos: Position;
  }> = new Map();
  private defeatedAnimals: Set<string> = new Set();
  private bossDefeated = false;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { level: number }): void {
    this.levelData = LEVEL_MAP[data.level];
    this.isMoving = false;
    this.isPaused = false;
    this.itemSprites.clear();
    this.placedItems.clear();
    this.collectedItems = { stars: 0, coins: 0, keys: 0 };
    this.totalItems = { stars: 0, coins: 0 };
    this.gateSprites.clear();
    this.unlockedGates.clear();
    this.gateCellToData.clear();
    this.barrierSprites.clear();
    this.unlockedBarriers.clear();
    this.teleportSprites.clear();
    this.teleportMap.clear();
    this.trapSprites.clear();
    this.trapPhase = 0;
    this.currentSprites.clear();
    this.lastMoveDirection = "right";
    this.fogSprites.clear();
    this.revealedFog.clear();
    this.vineBridgeSprites.clear();
    this.vineBridgeUses.clear();
    this.patrolAnimalSprites.clear();
    this.defeatedAnimals.clear();
    this.bossDefeated = false;
    this.exitLocked = false;

    if (!this.levelData) {
      console.error(`Level ${data.level} not found`);
      this.scene.start("LevelSelectScene");
    }
  }

  create(): void {
    this.progressManager = new ProgressManager();
    this.startTime = Date.now();

    // Generate maze
    this.grid = MazeGenerator.generate(
      this.levelData.gridWidth,
      this.levelData.gridHeight,
      this.levelData.seed,
      this.levelData.startPosition,
      this.levelData.exitPosition
    );

    // Collect all walkable path cells for placing items
    const walkableCells: Position[] = [];

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const t = this.grid[y][x].type;
        if (t === "path") walkableCells.push({ x, y });
        if (t === "start") this.startGridPos = { x, y };
        if (t === "exit") this.exitPos = { x, y };
      }
    }

    // Calculate offset to center maze
    const mazePixelWidth = this.levelData.gridWidth * TILE_SIZE;
    const mazePixelHeight = this.levelData.gridHeight * TILE_SIZE;
    this.offsetX = (this.cameras.main.width - mazePixelWidth) / 2;
    this.offsetY = (this.cameras.main.height - mazePixelHeight) / 2;

    // Track occupied cells (start, exit, gates, barriers)
    const occupied = new Set<string>();
    occupied.add(`${this.startGridPos.x},${this.startGridPos.y}`);
    occupied.add(`${this.exitPos.x},${this.exitPos.y}`);

    // Render maze tiles
    const isOcean = this.isOceanLevel();
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const cell = this.grid[y][x];
        const px = this.offsetX + x * TILE_SIZE + TILE_SIZE / 2;
        const py = this.offsetY + y * TILE_SIZE + TILE_SIZE / 2;

        let textureKey = this.getThemeTexture("wall", "ocean_wall", "jungle_wall");
        if (cell.type === "path") textureKey = this.getThemeTexture("path", "ocean_path", "jungle_path");
        else if (cell.type === "start") textureKey = this.getThemeTexture("path", "ocean_path", "jungle_path");
        else if (cell.type === "exit") textureKey = this.getThemeTexture("path", "ocean_path", "jungle_path");

        this.add.image(px, py, textureKey).setDisplaySize(TILE_SIZE, TILE_SIZE);
      }
    }

    // Place puzzle gates on unique walkable cells
    for (const gate of this.levelData.puzzleGates) {
      const gridPos = this.pickUniqueCell(walkableCells, occupied, gate.position);
      if (!gridPos) continue;
      const cellKey = `${gridPos.x},${gridPos.y}`;
      occupied.add(cellKey);

      const px = this.offsetX + gridPos.x * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + gridPos.y * TILE_SIZE + TILE_SIZE / 2;

      const sprite = this.add
        .image(px, py, "gate_locked")
        .setDisplaySize(TILE_SIZE, TILE_SIZE)
        .setDepth(1);
      this.gateSprites.set(cellKey, sprite);
      this.gateCellToData.set(cellKey, gate);
    }

    // --- Step 1: Pre-compute actual key positions BEFORE placing barriers ---
    const keyPositions = new Map<ItemPlacementData, Position>();
    for (const item of this.levelData.items) {
      if (item.itemType === "key") {
        const pos = this.pickUniqueCell(walkableCells, occupied, item.position);
        if (pos) {
          keyPositions.set(item, pos);
          occupied.add(`${pos.x},${pos.y}`);
        }
      }
    }

    // --- Step 2: Place barriers ON the main path, AFTER all key branch points ---
    const mainPath = this.findPath(this.startGridPos, this.exitPos);
    const keyItemsWithGate = this.levelData.items.filter(
      (i) => i.itemType === "key" && i.requiredForGate
    );

    if (mainPath && mainPath.length > 4 && keyItemsWithGate.length > 0) {
      const mainPathIdx = new Map<string, number>();
      mainPath.forEach((p, idx) =>
        mainPathIdx.set(`${p.x},${p.y}`, idx)
      );

      // Find the MAXIMUM branch point across ALL keys so no barrier
      // blocks access to any key
      let maxBranchIdx = 0;
      for (const keyItem of keyItemsWithGate) {
        const keyActualPos = keyPositions.get(keyItem);
        if (!keyActualPos) continue;
        const keyPath = this.findPath(this.startGridPos, keyActualPos);
        if (!keyPath) continue;
        for (const cell of keyPath) {
          const idx = mainPathIdx.get(`${cell.x},${cell.y}`);
          if (idx !== undefined && idx > maxBranchIdx) {
            maxBranchIdx = idx;
          }
        }
      }

      // Place all barriers after maxBranchIdx, spread evenly
      const barrierCount = keyItemsWithGate.length;
      const safeStart = maxBranchIdx + 1;
      const safeEnd = mainPath.length - 2;

      if (safeStart <= safeEnd) {
        const range = safeEnd - safeStart;
        for (let i = 0; i < barrierCount; i++) {
          const targetIdx = Math.min(
            safeStart +
              Math.max(
                Math.floor((range * (i + 1)) / (barrierCount + 1)),
                1
              ),
            safeEnd
          );

          let barrierPos: Position | null = null;
          for (let d = 0; d < mainPath.length && !barrierPos; d++) {
            const candidates =
              d === 0 ? [targetIdx] : [targetIdx + d, targetIdx - d];
            for (const tryIdx of candidates) {
              if (tryIdx <= maxBranchIdx || tryIdx >= mainPath.length - 1)
                continue;
              const pos = mainPath[tryIdx];
              const ck = `${pos.x},${pos.y}`;
              if (!occupied.has(ck)) {
                barrierPos = pos;
                break;
              }
            }
          }

          if (!barrierPos) continue;
          const cellKey = `${barrierPos.x},${barrierPos.y}`;
          occupied.add(cellKey);

          const px =
            this.offsetX + barrierPos.x * TILE_SIZE + TILE_SIZE / 2;
          const py =
            this.offsetY + barrierPos.y * TILE_SIZE + TILE_SIZE / 2;

          const sprite = this.add
            .image(px, py, "barrier_locked")
            .setDisplaySize(TILE_SIZE, TILE_SIZE)
            .setDepth(1);
          this.barrierSprites.set(cellKey, sprite);
        }
      }
    }

    // Place teleport pairs
    const teleportColors = [0xaa44ff, 0x44aaff, 0xff44aa, 0x44ffaa];
    const teleportPairs = this.levelData.teleportPairs || [];
    for (let i = 0; i < teleportPairs.length; i++) {
      const pair = teleportPairs[i];
      const color = teleportColors[i % teleportColors.length];

      const posA = this.pickUniqueCell(walkableCells, occupied, pair.posA);
      if (!posA) continue;
      const keyA = `${posA.x},${posA.y}`;
      occupied.add(keyA);

      const posB = this.pickUniqueCell(walkableCells, occupied, pair.posB);
      if (!posB) continue;
      const keyB = `${posB.x},${posB.y}`;
      occupied.add(keyB);

      // Render both pads
      const teleportTexture = this.getThemeTexture("teleport", "whirlpool", "tree_hole");
      for (const [pos, key] of [
        [posA, keyA],
        [posB, keyB],
      ] as [Position, string][]) {
        const px = this.offsetX + pos.x * TILE_SIZE + TILE_SIZE / 2;
        const py = this.offsetY + pos.y * TILE_SIZE + TILE_SIZE / 2;
        const sprite = this.add
          .image(px, py, teleportTexture)
          .setDisplaySize(TILE_SIZE * 0.8, TILE_SIZE * 0.8)
          .setTint(color)
          .setDepth(1);
        // Pulsing animation
        this.tweens.add({
          targets: sprite,
          scaleX: sprite.scaleX * 1.15,
          scaleY: sprite.scaleY * 1.15,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        this.teleportSprites.set(key, sprite);
      }

      // Map each pad to the other's position
      this.teleportMap.set(keyA, posB);
      this.teleportMap.set(keyB, posA);
    }

    // Place items on unique walkable cells (no overlaps)
    // Keys already have pre-computed positions from barrier placement step
    for (const item of this.levelData.items) {
      const gridPos =
        keyPositions.get(item) ||
        this.pickUniqueCell(walkableCells, occupied, item.position);
      if (!gridPos) continue;
      const cellKey = `${gridPos.x},${gridPos.y}`;
      occupied.add(cellKey);

      const px = this.offsetX + gridPos.x * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + gridPos.y * TILE_SIZE + TILE_SIZE / 2;

      let textureKey = this.getThemeTexture("star", "starfish", "gem");
      if (item.itemType === "coin") textureKey = this.getThemeTexture("coin", "pearl", "fruit");
      else if (item.itemType === "key") textureKey = this.getThemeTexture("key", "shell", "totem");

      if (item.itemType === "star") this.totalItems.stars++;
      else if (item.itemType === "coin") this.totalItems.coins++;

      const sprite = this.add
        .image(px, py, textureKey)
        .setDisplaySize(TILE_SIZE * 0.7, TILE_SIZE * 0.7)
        .setDepth(1);
      this.itemSprites.set(cellKey, sprite);
      this.placedItems.set(cellKey, { gridPos, data: item });
    }

    // Place traps (levels 36+)
    const traps = this.levelData.traps || [];
    for (const trap of traps) {
      const gridPos = this.pickUniqueCell(
        walkableCells,
        occupied,
        trap.position
      );
      if (!gridPos) continue;
      const cellKey = `${gridPos.x},${gridPos.y}`;
      occupied.add(cellKey);

      const px = this.offsetX + gridPos.x * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + gridPos.y * TILE_SIZE + TILE_SIZE / 2;

      const trapTexture = this.getThemeTexture("trap", "jellyfish", "jungle_trap");
      const sprite = this.add
        .image(px, py, trapTexture)
        .setDisplaySize(TILE_SIZE * 0.75, TILE_SIZE * 0.75)
        .setDepth(1)
        .setAlpha(trap.group === 0 ? 1 : 0.2);
      this.trapSprites.set(cellKey, { sprite, group: trap.group });
    }

    // Start trap cycle timer (1.5s per phase)
    if (traps.length > 0) {
      this.trapPhase = 0;
      this.time.addEvent({
        delay: 1500,
        loop: true,
        callback: () => this.toggleTraps(),
      });
    }

    // Place water currents
    const waterCurrents = this.levelData.waterCurrents || [];
    for (const current of waterCurrents) {
      const gridPos = this.pickUniqueCell(walkableCells, occupied, current.position);
      if (!gridPos) continue;
      const cellKey = `${gridPos.x},${gridPos.y}`;
      occupied.add(cellKey);

      const px = this.offsetX + gridPos.x * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + gridPos.y * TILE_SIZE + TILE_SIZE / 2;

      const rotationMap: Record<string, number> = {
        right: 0,
        down: Math.PI / 2,
        left: Math.PI,
        up: -Math.PI / 2,
      };

      const sprite = this.add
        .image(px, py, "water_current")
        .setDisplaySize(TILE_SIZE, TILE_SIZE)
        .setRotation(rotationMap[current.direction] || 0)
        .setDepth(0.5)
        .setAlpha(0.7);

      this.currentSprites.set(cellKey, {
        sprite,
        direction: current.direction,
        strength: current.strength,
      });
    }

    // Place fog zones (rendered AFTER items so fog covers them)
    // Fog deliberately IGNORES occupied set — it can overlay water currents,
    // teleporters, traps, items etc. to hide them as surprises.
    const fogZones = this.levelData.fogZones || [];
    for (const fog of fogZones) {
      // Find nearest walkable cell without checking occupied
      const targetX = Math.min(Math.max(1, fog.position.x | 1), this.levelData.gridWidth - 2);
      const targetY = Math.min(Math.max(1, fog.position.y | 1), this.levelData.gridHeight - 2);
      const cellKey = `${targetX},${targetY}`;

      // Skip if not a walkable cell or already has fog
      if (this.grid[targetY]?.[targetX]?.type === "wall") continue;
      if (this.fogSprites.has(cellKey)) continue;
      // Don't fog the start or exit
      if (targetX === this.startGridPos.x && targetY === this.startGridPos.y) continue;
      if (targetX === this.exitPos.x && targetY === this.exitPos.y) continue;

      const px = this.offsetX + targetX * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + targetY * TILE_SIZE + TILE_SIZE / 2;

      const fogTextureKey = this.getThemeTexture("fog", "fog", "jungle_fog");
      const sprite = this.add
        .image(px, py, fogTextureKey)
        .setDisplaySize(TILE_SIZE, TILE_SIZE)
        .setDepth(3);

      this.fogSprites.set(cellKey, sprite);
    }

    // Place vine bridges (jungle theme)
    const vineBridges: VineBridgeData[] = (this.levelData as any).vineBridges || [];
    for (const bridge of vineBridges) {
      const gridPos = this.pickUniqueCell(walkableCells, occupied, bridge.position);
      if (!gridPos) continue;
      const cellKey = `${gridPos.x},${gridPos.y}`;
      occupied.add(cellKey);

      const px = this.offsetX + gridPos.x * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + gridPos.y * TILE_SIZE + TILE_SIZE / 2;

      const sprite = this.add
        .image(px, py, "vine_bridge")
        .setDisplaySize(TILE_SIZE, TILE_SIZE)
        .setDepth(0.5)
        .setAlpha(0.9);
      this.vineBridgeSprites.set(cellKey, sprite);
    }

    // Place patrol animals (jungle theme)
    const patrolAnimals: PatrolAnimalData[] = (this.levelData as any).patrolAnimals || [];
    for (const animal of patrolAnimals) {
      const startPos = this.pickUniqueCell(walkableCells, occupied, animal.startPosition);
      if (!startPos) continue;

      const px = this.offsetX + startPos.x * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + startPos.y * TILE_SIZE + TILE_SIZE / 2;

      const sprite = this.add
        .image(px, py, "patrol_animal")
        .setDisplaySize(TILE_SIZE * 0.85, TILE_SIZE * 0.85)
        .setDepth(2)
        .setTint(this.getAnimalTint(animal.animalType));

      this.patrolAnimalSprites.set(animal.id, {
        sprite,
        data: animal,
        currentWaypoint: 0,
        gridPos: { ...startPos },
      });

      // Start patrol movement
      this.startPatrolMovement(animal.id);
    }

    // Place boss at exit (if level has boss data)
    const bossData = (this.levelData as any).boss;
    if (bossData) {
      const bossX = this.exitPos.x;
      const bossY = this.exitPos.y;
      const bpx = this.offsetX + bossX * TILE_SIZE + TILE_SIZE / 2;
      const bpy = this.offsetY + bossY * TILE_SIZE + TILE_SIZE / 2;

      const bossSprite = this.add
        .image(bpx, bpy, "patrol_animal")
        .setDisplaySize(TILE_SIZE * 1.2, TILE_SIZE * 1.2)
        .setDepth(3)
        .setTint(0xff4444);

      this.tweens.add({
        targets: bossSprite,
        scaleX: bossSprite.scaleX * 1.1,
        scaleY: bossSprite.scaleY * 1.1,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      this.patrolAnimalSprites.set("boss", {
        sprite: bossSprite,
        data: {
          id: "boss",
          startPosition: { x: bossX, y: bossY },
          patrolPath: [],
          speed: 0,
          animalType: bossData.animalType || "leopard",
        },
        currentWaypoint: 0,
        gridPos: { x: bossX, y: bossY },
      });
    }

    // Listen for battle results
    this.events.on("battle-result", (result: { won: boolean; animalId: string; isBoss: boolean }) => {
      this.handleBattleResult(result);
    });

    // Determine if exit should be locked (stars exist = must collect all)
    this.exitLocked = this.totalItems.stars > 0;

    // Start sprite overlay
    const startPx = this.offsetX + this.startGridPos.x * TILE_SIZE + TILE_SIZE / 2;
    const startPy = this.offsetY + this.startGridPos.y * TILE_SIZE + TILE_SIZE / 2;
    this.add
      .image(startPx, startPy, "start_img")
      .setDisplaySize(TILE_SIZE, TILE_SIZE)
      .setDepth(1);

    // Exit sprite overlay
    const exitPx = this.offsetX + this.exitPos.x * TILE_SIZE + TILE_SIZE / 2;
    const exitPy = this.offsetY + this.exitPos.y * TILE_SIZE + TILE_SIZE / 2;
    this.exitSprite = this.add
      .image(exitPx, exitPy, this.exitLocked ? "exit_locked_img" : "exit_img")
      .setDisplaySize(TILE_SIZE, TILE_SIZE)
      .setDepth(1);

    // Player
    this.playerPos = { ...this.startGridPos };
    const playerPx =
      this.offsetX + this.startGridPos.x * TILE_SIZE + TILE_SIZE / 2;
    const playerPy =
      this.offsetY + this.startGridPos.y * TILE_SIZE + TILE_SIZE / 2;
    this.player = this.add
      .image(playerPx, playerPy, "player_img")
      .setDisplaySize(TILE_SIZE * 0.8, TILE_SIZE * 0.8)
      .setDepth(2);
    this.player.setData("origScaleX", this.player.scaleX);
    this.player.setData("origScaleY", this.player.scaleY);

    // Camera follow for larger mazes
    if (
      mazePixelWidth > this.cameras.main.width ||
      mazePixelHeight > this.cameras.main.height
    ) {
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setBounds(
        this.offsetX,
        this.offsetY - 40,
        mazePixelWidth,
        mazePixelHeight + 80
      );
    }

    // Input manager (keyboard + touch D-pad)
    this.inputManager = new InputManager(this, (dir) => this.tryMove(dir));

    // HUD
    this.hudText = this.add
      .text(10, 10, "", {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(10);
    this.updateHUD();

    // Pause button
    const pauseBtn = this.add
      .text(this.cameras.main.width - 10, 10, "II", {
        fontSize: "24px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 10, y: 4 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });

    pauseBtn.on("pointerdown", () => this.togglePause());

    // Listen for puzzle completion
    this.events.on("gate-unlocked", (cellKey: string) => {
      this.handleGateUnlocked(cellKey);
    });

    // Ocean atmosphere: bubble particles
    if (isOcean) {
      this.time.addEvent({
        delay: 400,
        loop: true,
        callback: () => {
          const bx = Phaser.Math.Between(0, this.cameras.main.width);
          const by = this.cameras.main.height + 10;
          const bubble = this.add.circle(bx, by, Phaser.Math.Between(2, 5), 0x88ccff, 0.4)
            .setScrollFactor(0)
            .setDepth(15);
          this.tweens.add({
            targets: bubble,
            y: -10,
            x: bx + Phaser.Math.Between(-20, 20),
            alpha: 0,
            duration: Phaser.Math.Between(3000, 5000),
            ease: "Sine.easeIn",
            onComplete: () => bubble.destroy(),
          });
        },
      });
    }

    // Jungle atmosphere: falling leaves
    if (this.isJungleLevel()) {
      this.time.addEvent({
        delay: 600,
        loop: true,
        callback: () => {
          const lx = Phaser.Math.Between(0, this.cameras.main.width);
          const leaf = this.add.circle(lx, -10, Phaser.Math.Between(2, 4), 0x228b22, 0.5)
            .setScrollFactor(0)
            .setDepth(15);
          this.tweens.add({
            targets: leaf,
            y: this.cameras.main.height + 10,
            x: lx + Phaser.Math.Between(-40, 40),
            alpha: 0,
            duration: Phaser.Math.Between(4000, 7000),
            ease: "Sine.easeIn",
            onComplete: () => leaf.destroy(),
          });
        },
      });
    }

    // Background music
    const bgmKey = this.getThemeTexture("bgm_standard", "bgm_ocean", "bgm_jungle");
    music.play(bgmKey);
  }

  update(): void {
    if (this.isMoving || this.isPaused) return;
    this.inputManager.update();
  }

  tryMove(direction: Direction): void {
    if (this.isMoving || this.isPaused) return;

    const dx = direction === "left" ? -1 : direction === "right" ? 1 : 0;
    const dy = direction === "up" ? -1 : direction === "down" ? 1 : 0;
    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;

    // Bounds check
    if (
      newX < 0 ||
      newX >= this.levelData.gridWidth ||
      newY < 0 ||
      newY >= this.levelData.gridHeight
    ) {
      return;
    }

    const targetCell = this.grid[newY][newX];

    // Wall check
    if (targetCell.type === "wall") return;

    // Collapsed vine bridge check (5 uses = destroyed)
    const bridgeUses = this.vineBridgeUses.get(`${newX},${newY}`) ?? 0;
    if (bridgeUses >= GameScene.MAX_BRIDGE_USES) return;

    const cellKey = `${newX},${newY}`;

    // Puzzle gate check
    if (this.gateSprites.has(cellKey) && !this.unlockedGates.has(cellKey)) {
      const gate = this.gateCellToData.get(cellKey);
      if (gate) {
        this.scene.launch("PuzzleScene", {
          gate,
          cellKey,
          parentScene: "GameScene",
        });
        this.isPaused = true;
      }
      return;
    }

    // Barrier check (any key opens any barrier)
    if (this.barrierSprites.has(cellKey) && !this.unlockedBarriers.has(cellKey)) {
      if (this.collectedItems.keys > 0) {
        // Player has a key — unlock barrier
        sfx.barrierUnlock();
        this.collectedItems.keys--;
        this.unlockedBarriers.add(cellKey);
        const sprite = this.barrierSprites.get(cellKey)!;
        this.tweens.add({
          targets: sprite,
          alpha: 0,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 300,
          ease: "Power2",
          onComplete: () => sprite.destroy(),
        });
        this.barrierSprites.delete(cellKey);
        this.updateHUD();
        return;
      } else {
        // No key — blocked
        return;
      }
    }

    // Save movement direction before animating
    this.lastMoveDirection = direction;

    // Move player
    sfx.move();
    this.isMoving = true;
    this.playerPos = { x: newX, y: newY };

    // Degrade vine bridge if player was standing on one
    const bridgeKey = this.player.getData("onVineBridge") as string | undefined;
    if (bridgeKey && bridgeKey !== `${newX},${newY}`) {
      this.player.setData("onVineBridge", null);
      const uses = (this.vineBridgeUses.get(bridgeKey) ?? 0) + 1;
      this.vineBridgeUses.set(bridgeKey, uses);
      const bridgeSprite = this.vineBridgeSprites.get(bridgeKey);

      if (uses >= GameScene.MAX_BRIDGE_USES) {
        // Final use — collapse the bridge
        if (bridgeSprite) {
          this.tweens.add({
            targets: bridgeSprite,
            alpha: 0,
            scaleY: 0,
            duration: 400,
            ease: "Power2",
            onComplete: () => {
              bridgeSprite.destroy();
              this.vineBridgeSprites.delete(bridgeKey);
              const [bx, by] = bridgeKey.split(",").map(Number);
              if (this.grid[by]?.[bx]) {
                this.grid[by][bx].type = "wall";
                const wpx = this.offsetX + bx * TILE_SIZE + TILE_SIZE / 2;
                const wpy = this.offsetY + by * TILE_SIZE + TILE_SIZE / 2;
                const wallTexture = this.isJungleLevel() ? "jungle_wall" : this.isOceanLevel() ? "ocean_wall" : "wall";
                this.add.image(wpx, wpy, wallTexture).setDisplaySize(TILE_SIZE, TILE_SIZE);
              }
            },
          });
        }
      } else if (bridgeSprite) {
        // Visual degradation: 5→full(0.9), 4→0.75, 3→0.6, 2→0.45, 1→0.3
        const remaining = GameScene.MAX_BRIDGE_USES - uses;
        const targetAlpha = 0.3 + (remaining / GameScene.MAX_BRIDGE_USES) * 0.6;
        // Tint shifts from green-brown to red as it degrades
        const tints = [0xffffff, 0xffddaa, 0xffbb66, 0xff8833, 0xff4444];
        bridgeSprite.setTint(tints[uses - 1] ?? 0xff4444);
        // Shake animation to show damage
        this.tweens.add({
          targets: bridgeSprite,
          x: bridgeSprite.x + 3,
          duration: 50,
          yoyo: true,
          repeat: 3,
          ease: "Sine.easeInOut",
          onComplete: () => {
            bridgeSprite.setAlpha(targetAlpha);
          },
        });
      }
    }

    const targetPx = this.offsetX + newX * TILE_SIZE + TILE_SIZE / 2;
    const targetPy = this.offsetY + newY * TILE_SIZE + TILE_SIZE / 2;

    this.tweens.add({
      targets: this.player,
      x: targetPx,
      y: targetPy,
      duration: 100,
      ease: "Linear",
      onComplete: () => {
        this.isMoving = false;
        this.checkTile(newX, newY);
      },
    });
  }

  private checkTile(x: number, y: number): void {
    const cell = this.grid[y][x];
    const cellKey = `${x},${y}`;

    // Reveal fog in 1-tile radius
    this.revealFog(x, y);

    // Check if standing on vine bridge — mark for degradation when leaving
    const bridgeUsed = this.vineBridgeUses.get(cellKey) ?? 0;
    if (this.vineBridgeSprites.has(cellKey) && bridgeUsed < GameScene.MAX_BRIDGE_USES) {
      this.player.setData("onVineBridge", cellKey);
    }

    // Check for patrol animal collision
    for (const [id, animal] of this.patrolAnimalSprites) {
      if (this.defeatedAnimals.has(id)) continue;
      if (animal.gridPos.x === x && animal.gridPos.y === y) {
        this.triggerBattle(id);
        return;
      }
    }

    // Check for item collection
    if (this.itemSprites.has(cellKey)) {
      const sprite = this.itemSprites.get(cellKey)!;
      const placed = this.placedItems.get(cellKey)!;

      if (placed.data.itemType === "star") {
        this.collectedItems.stars++;
        sfx.collectStar();
        // Check if all stars collected — unlock exit
        if (this.collectedItems.stars >= this.totalItems.stars && this.exitLocked) {
          this.exitLocked = false;
          this.updateExitSprite();
          sfx.exitUnlock();
        }
      } else if (placed.data.itemType === "coin") {
        this.collectedItems.coins++;
        sfx.collectCoin();
      } else if (placed.data.itemType === "key") {
        this.collectedItems.keys++;
        sfx.collectKey();
      }

      // Collect animation
      this.tweens.add({
        targets: sprite,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 200,
        ease: "Power2",
        onComplete: () => sprite.destroy(),
      });

      this.itemSprites.delete(cellKey);
      this.placedItems.delete(cellKey);
      this.updateHUD();
    }

    // Check for trap (only dangerous when active)
    const trapInfo = this.trapSprites.get(cellKey);
    if (trapInfo && trapInfo.group === this.trapPhase) {
      this.handleTrapHit();
      return;
    }

    // Check for teleport
    if (this.teleportMap.has(cellKey)) {
      const dest = this.teleportMap.get(cellKey)!;
      this.handleTeleport(dest);
      return;
    }

    // Check for water current — only push if NOT walking against the current
    const currentInfo = this.currentSprites.get(cellKey);
    if (currentInfo) {
      const opposites: Record<string, string> = { up: "down", down: "up", left: "right", right: "left" };
      if (this.lastMoveDirection !== opposites[currentInfo.direction]) {
        this.handleWaterCurrent(currentInfo.direction, currentInfo.strength);
        return;
      }
      // Walking against current — player fights through, no push
    }

    // Check for exit
    if (cell.type === "exit" && !this.exitLocked) {
      const bossData = (this.levelData as any).boss;
      if (bossData && !this.bossDefeated) {
        this.isPaused = true;
        this.scene.launch("BattleScene", {
          animalType: bossData.animalType || "leopard",
          animalHp: bossData.hp || 5,
          attacksPerRound: bossData.attacksPerRound || 3,
          timingBarSpeed: 500,
          perfectZoneSize: 0.08,
          parentScene: "GameScene",
          animalId: "boss",
          isBoss: true,
        });
        return;
      }
      this.handleLevelComplete();
    }
  }

  private handleTeleport(dest: Position): void {
    sfx.teleport();
    this.isMoving = true;

    // Shrink player at current position
    this.tweens.add({
      targets: this.player,
      scaleX: 0,
      scaleY: 0,
      alpha: 0.3,
      duration: 200,
      ease: "Power2",
      onComplete: () => {
        // Move player to destination
        this.playerPos = { ...dest };
        const px = this.offsetX + dest.x * TILE_SIZE + TILE_SIZE / 2;
        const py = this.offsetY + dest.y * TILE_SIZE + TILE_SIZE / 2;
        this.player.setPosition(px, py);

        // Expand player at destination
        this.tweens.add({
          targets: this.player,
          scaleX: this.player.getData("origScaleX") || this.player.scaleX || 0.7,
          scaleY: this.player.getData("origScaleY") || this.player.scaleY || 0.7,
          alpha: 1,
          duration: 200,
          ease: "Power2",
          onComplete: () => {
            this.isMoving = false;
          },
        });
      },
    });
  }

  private toggleTraps(): void {
    this.trapPhase = this.trapPhase === 0 ? 1 : 0;
    for (const [, trap] of this.trapSprites) {
      const isActive = trap.group === this.trapPhase;
      this.tweens.add({
        targets: trap.sprite,
        alpha: isActive ? 1 : 0.2,
        duration: 300,
        ease: "Power2",
      });
    }
  }

  private handleTrapHit(): void {
    sfx.trapHit();
    this.isMoving = true;
    this.cameras.main.flash(400, 255, 50, 50);

    // Shrink and teleport back to start
    this.tweens.add({
      targets: this.player,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 250,
      ease: "Power2",
      onComplete: () => {
        this.playerPos = { ...this.startGridPos };
        const px =
          this.offsetX + this.startGridPos.x * TILE_SIZE + TILE_SIZE / 2;
        const py =
          this.offsetY + this.startGridPos.y * TILE_SIZE + TILE_SIZE / 2;
        this.player.setPosition(px, py);

        this.tweens.add({
          targets: this.player,
          scaleX:
            this.player.getData("origScaleX") || this.player.scaleX || 0.7,
          scaleY:
            this.player.getData("origScaleY") || this.player.scaleY || 0.7,
          alpha: 1,
          duration: 250,
          ease: "Power2",
          onComplete: () => {
            this.isMoving = false;
          },
        });
      },
    });
  }

  private handleWaterCurrent(direction: Direction, strength: number): void {
    this.isMoving = true;
    sfx.teleport(); // reuse teleport sound

    const dx = direction === "left" ? -1 : direction === "right" ? 1 : 0;
    const dy = direction === "up" ? -1 : direction === "down" ? 1 : 0;

    let finalX = this.playerPos.x;
    let finalY = this.playerPos.y;

    for (let i = 0; i < strength; i++) {
      const nextX = finalX + dx;
      const nextY = finalY + dy;

      if (nextX < 0 || nextX >= this.levelData.gridWidth ||
          nextY < 0 || nextY >= this.levelData.gridHeight) break;
      if (this.grid[nextY][nextX].type === "wall") break;

      const nextKey = `${nextX},${nextY}`;
      if (this.gateSprites.has(nextKey) && !this.unlockedGates.has(nextKey)) break;
      if (this.barrierSprites.has(nextKey) && !this.unlockedBarriers.has(nextKey)) break;

      finalX = nextX;
      finalY = nextY;
    }

    if (finalX === this.playerPos.x && finalY === this.playerPos.y) {
      this.isMoving = false;
      return;
    }

    this.playerPos = { x: finalX, y: finalY };
    const targetPx = this.offsetX + finalX * TILE_SIZE + TILE_SIZE / 2;
    const targetPy = this.offsetY + finalY * TILE_SIZE + TILE_SIZE / 2;

    this.tweens.add({
      targets: this.player,
      x: targetPx,
      y: targetPy,
      duration: 150 * strength,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.isMoving = false;
        this.checkTile(finalX, finalY);
      },
    });
  }

  private revealFog(cx: number, cy: number): void {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const fx = cx + dx;
        const fy = cy + dy;
        const fKey = `${fx},${fy}`;
        if (this.revealedFog.has(fKey)) continue;
        const fogSprite = this.fogSprites.get(fKey);
        if (fogSprite) {
          this.revealedFog.add(fKey);
          this.tweens.add({
            targets: fogSprite,
            alpha: 0,
            duration: 300,
            ease: "Power2",
            onComplete: () => fogSprite.destroy(),
          });
          this.fogSprites.delete(fKey);
        }
      }
    }
  }

  private isOceanLevel(): boolean {
    return this.levelData.level >= 51 && this.levelData.level <= 65;
  }

  private isJungleLevel(): boolean {
    return this.levelData.level >= 66 && this.levelData.level <= 80;
  }

  private getThemeTexture(standard: string, ocean: string, jungle: string): string {
    if (this.isJungleLevel()) return jungle;
    if (this.isOceanLevel()) return ocean;
    return standard;
  }

  private getAnimalTint(type: AnimalType): number {
    const tints: Record<AnimalType, number> = {
      snake: 0x66bb6a,
      monkey: 0xffb74d,
      lizard: 0x4db6ac,
      leopard: 0xffd54f,
      parrot: 0xef5350,
      crocodile: 0x66bb6a,
      spider: 0x9e9e9e,
    };
    return tints[type] || 0xffffff;
  }

  private updateExitSprite(): void {
    if (!this.exitSprite) return;
    this.exitSprite.setTexture("exit_img");
    // Flash animation to draw attention
    this.tweens.add({
      targets: this.exitSprite,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 200,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });
  }

  private handleGateUnlocked(cellKey: string): void {
    sfx.gateOpen();
    this.unlockedGates.add(cellKey);
    const sprite = this.gateSprites.get(cellKey);
    if (sprite) {
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 300,
        ease: "Power2",
        onComplete: () => sprite.destroy(),
      });
      this.gateSprites.delete(cellKey);
    }
    this.isPaused = false;
  }

  private handleLevelComplete(): void {
    sfx.levelComplete();
    this.isMoving = true;
    const elapsed = (Date.now() - this.startTime) / 1000;

    const nextLevel = this.levelData.level + 1;
    if (nextLevel <= TOTAL_LEVELS) {
      this.progressManager.unlockLevel(nextLevel);
    }

    this.progressManager.setLevelScore(this.levelData.level, {
      completed: true,
      starsCollected: this.collectedItems.stars,
      coinsCollected: this.collectedItems.coins,
      totalStars: this.totalItems.stars,
      totalCoins: this.totalItems.coins,
      bestTimeSeconds: Math.round(elapsed),
    });

    this.time.delayedCall(500, () => {
      this.scene.start("LevelCompleteScene", {
        level: this.levelData.level,
        timeSeconds: Math.round(elapsed),
        starsCollected: this.collectedItems.stars,
        totalStars: this.totalItems.stars,
        coinsCollected: this.collectedItems.coins,
        totalCoins: this.totalItems.coins,
      });
    });
  }

  private updateHUD(): void {
    if (!this.hudText) return;
    const parts: string[] = [`Lv.${this.levelData.level}`];
    if (this.totalItems.stars > 0) {
      const remaining = this.totalItems.stars - this.collectedItems.stars;
      parts.push(
        remaining > 0
          ? `Stars: ${this.collectedItems.stars}/${this.totalItems.stars} (collect all!)`
          : `Stars: ${this.collectedItems.stars}/${this.totalItems.stars} OK!`
      );
    }
    if (this.totalItems.coins > 0) {
      parts.push(`Coins: ${this.collectedItems.coins}/${this.totalItems.coins}`);
    }
    if (this.collectedItems.keys > 0) {
      parts.push(`Keys: ${this.collectedItems.keys}`);
    }
    this.hudText.setText(parts.join("  |  "));
  }

  private togglePause(): void {
    if (this.isPaused && this.pauseOverlay) {
      this.pauseOverlay.forEach((obj) => obj.destroy());
      this.pauseOverlay = undefined;
      this.isPaused = false;
      return;
    }

    this.isPaused = true;
    const { width, height } = this.cameras.main;
    const depth = 20;
    const elements: Phaser.GameObjects.GameObject[] = [];

    const bg = this.add.graphics().setScrollFactor(0).setDepth(depth);
    bg.fillStyle(0x000000, 0.7);
    bg.fillRect(0, 0, width, height);
    elements.push(bg);

    const title = this.add
      .text(width / 2, height / 3, "暫停", {
        fontSize: "40px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1);
    elements.push(title);

    const resumeBtn = this.add
      .text(width / 2, height / 2, "繼續遊戲", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#4a90d9",
        padding: { x: 30, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1)
      .setInteractive({ useHandCursor: true });
    resumeBtn.on("pointerdown", () => this.togglePause());
    elements.push(resumeBtn);

    const quitBtn = this.add
      .text(width / 2, height / 2 + 70, "回到選單", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#cc3333",
        padding: { x: 30, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(depth + 1)
      .setInteractive({ useHandCursor: true });
    quitBtn.on("pointerdown", () => {
      this.scene.start("LevelSelectScene");
    });
    elements.push(quitBtn);

    this.pauseOverlay = elements;
  }

  /** BFS shortest path through the maze grid (non-wall cells) */
  private findPath(from: Position, to: Position): Position[] | null {
    const parent = new Map<string, Position | null>();
    const fromKey = `${from.x},${from.y}`;
    const toKey = `${to.x},${to.y}`;
    parent.set(fromKey, null);
    const queue: Position[] = [from];

    while (queue.length > 0) {
      const pos = queue.shift()!;
      if (`${pos.x},${pos.y}` === toKey) {
        // Reconstruct path
        const path: Position[] = [];
        let ck = toKey;
        while (true) {
          const [px, py] = ck.split(",").map(Number);
          path.unshift({ x: px, y: py });
          const p = parent.get(ck);
          if (!p) break;
          ck = `${p.x},${p.y}`;
        }
        return path;
      }

      for (const [dx, dy] of [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ]) {
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        if (
          nx < 0 ||
          nx >= this.levelData.gridWidth ||
          ny < 0 ||
          ny >= this.levelData.gridHeight
        )
          continue;
        const nk = `${nx},${ny}`;
        if (parent.has(nk)) continue;
        if (this.grid[ny][nx].type === "wall") continue;
        parent.set(nk, pos);
        queue.push({ x: nx, y: ny });
      }
    }
    return null;
  }

  private startPatrolMovement(animalId: string): void {
    const animal = this.patrolAnimalSprites.get(animalId);
    if (!animal || this.defeatedAnimals.has(animalId)) return;

    const { data } = animal;
    if (!data.patrolPath || data.patrolPath.length === 0) return;

    const moveToNextWaypoint = () => {
      const a = this.patrolAnimalSprites.get(animalId);
      if (!a || this.defeatedAnimals.has(animalId)) return;

      a.currentWaypoint = (a.currentWaypoint + 1) % data.patrolPath.length;
      const target = data.patrolPath[a.currentWaypoint];

      const targetX = Math.min(Math.max(1, target.x | 1), this.levelData.gridWidth - 2);
      const targetY = Math.min(Math.max(1, target.y | 1), this.levelData.gridHeight - 2);

      const px = this.offsetX + targetX * TILE_SIZE + TILE_SIZE / 2;
      const py = this.offsetY + targetY * TILE_SIZE + TILE_SIZE / 2;

      const dist = Math.abs(targetX - a.gridPos.x) + Math.abs(targetY - a.gridPos.y);
      const duration = (dist / data.speed) * 1000;

      a.gridPos = { x: targetX, y: targetY };

      this.tweens.add({
        targets: a.sprite,
        x: px,
        y: py,
        duration: Math.max(duration, 300),
        ease: "Linear",
        onComplete: () => {
          if (this.playerPos.x === targetX && this.playerPos.y === targetY) {
            this.triggerBattle(animalId);
          }
          this.time.delayedCall(200, moveToNextWaypoint);
        },
      });
    };

    const delay = (1 / data.speed) * 500;
    this.time.delayedCall(delay, moveToNextWaypoint);
  }

  private triggerBattle(animalId: string): void {
    const animal = this.patrolAnimalSprites.get(animalId);
    if (!animal || this.defeatedAnimals.has(animalId)) return;

    this.isPaused = true;
    const level = this.levelData.level;

    const progress = Math.max(0, Math.min(1, (level - 66) / 14));
    const speed = 200 + progress * 300;
    const perfectSize = 0.2 - progress * 0.12;

    this.scene.launch("BattleScene", {
      animalType: animal.data.animalType,
      animalHp: 3,
      attacksPerRound: 1,
      timingBarSpeed: speed,
      perfectZoneSize: perfectSize,
      parentScene: "GameScene",
      animalId,
      isBoss: false,
    });
  }

  private handleBattleResult(result: { won: boolean; animalId: string; isBoss: boolean }): void {
    this.isPaused = false;

    if (result.won) {
      this.defeatedAnimals.add(result.animalId);

      if (result.isBoss) {
        this.bossDefeated = true;
        this.time.delayedCall(500, () => this.handleLevelComplete());
        return;
      }

      const animal = this.patrolAnimalSprites.get(result.animalId);
      if (animal) {
        this.tweens.add({
          targets: animal.sprite,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 400,
          onComplete: () => animal.sprite.destroy(),
        });
        this.patrolAnimalSprites.delete(result.animalId);
      }
    } else {
      this.handleTrapHit();
    }
  }

  /**
   * Find a unique walkable cell near the desired position that isn't already occupied.
   * Uses Manhattan distance to pick the closest available cell.
   */
  private pickUniqueCell(
    walkable: Position[],
    occupied: Set<string>,
    desired: Position
  ): Position | null {
    // Map desired to grid coords (same logic as old findNearestPath)
    const cellW = Math.floor((this.levelData.gridWidth - 1) / 2);
    const cellH = Math.floor((this.levelData.gridHeight - 1) / 2);
    const cx = Math.max(0, Math.min(Math.floor(desired.x / 2), cellW - 1));
    const cy = Math.max(0, Math.min(Math.floor(desired.y / 2), cellH - 1));
    const targetX = cx * 2 + 1;
    const targetY = cy * 2 + 1;

    // If target cell is walkable and not occupied, use it
    const targetKey = `${targetX},${targetY}`;
    if (!occupied.has(targetKey)) {
      const found = walkable.find((c) => c.x === targetX && c.y === targetY);
      if (found) return found;
    }

    // Otherwise find closest unoccupied walkable cell
    let best: Position | null = null;
    let bestDist = Infinity;
    for (const cell of walkable) {
      const key = `${cell.x},${cell.y}`;
      if (occupied.has(key)) continue;
      const dist = Math.abs(cell.x - targetX) + Math.abs(cell.y - targetY);
      if (dist < bestDist) {
        bestDist = dist;
        best = cell;
      }
    }
    return best;
  }
}
