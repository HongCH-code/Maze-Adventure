export interface Position {
  x: number;
  y: number;
}

export type CellType = "wall" | "path" | "start" | "exit";

export type ItemType = "star" | "coin" | "key";

export type PuzzleType =
  | "addition"
  | "subtraction"
  | "counting"
  | "comparison"
  | "twoDigitAdd"
  | "twoDigitSub"
  | "placeValue"
  | "ordering";

export type DifficultyTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PuzzleGateData {
  position: Position;
  puzzleType: PuzzleType;
  difficulty: DifficultyTier;
  id: string;
}

export interface ItemPlacementData {
  position: Position;
  itemType: ItemType;
  requiredForGate: string | null;
}

export interface TeleportPairData {
  id: string;
  posA: Position;
  posB: Position;
}

export interface TrapData {
  position: Position;
  group: 0 | 1;
}

export interface LevelData {
  level: number;
  gridWidth: number;
  gridHeight: number;
  seed: number;
  difficultyTier: DifficultyTier;
  puzzleGates: PuzzleGateData[];
  items: ItemPlacementData[];
  teleportPairs?: TeleportPairData[];
  traps?: TrapData[];
  startPosition: Position;
  exitPosition: Position;
}

export interface MazeCell {
  x: number;
  y: number;
  type: CellType;
  walls: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
  };
}

export interface Puzzle {
  question: string;
  correctAnswer: number;
  choices: number[];
  puzzleType: PuzzleType;
}

export interface LevelScore {
  completed: boolean;
  starsCollected: number;
  coinsCollected: number;
  totalStars: number;
  totalCoins: number;
  bestTimeSeconds: number;
}

export interface PlayerProgress {
  highestUnlockedLevel: number;
  levelScores: Record<number, LevelScore>;
}

export type Direction = "up" | "down" | "left" | "right";
