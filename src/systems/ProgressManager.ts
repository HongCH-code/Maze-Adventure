import { PlayerProgress, LevelScore } from "../types";

const STORAGE_KEY = "maze-adventure-progress";

const DEFAULT_PROGRESS: PlayerProgress = {
  highestUnlockedLevel: 1,
  levelScores: {},
};

export class ProgressManager {
  private progress: PlayerProgress;

  constructor() {
    this.progress = this.load();
  }

  load(): PlayerProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PlayerProgress;
        if (parsed.highestUnlockedLevel && parsed.levelScores) {
          return parsed;
        }
      }
    } catch {
      // Corrupted data — reset
    }
    return { ...DEFAULT_PROGRESS, levelScores: {} };
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // localStorage full or unavailable — silent fail
    }
  }

  getProgress(): PlayerProgress {
    return this.progress;
  }

  isLevelUnlocked(level: number): boolean {
    return level <= this.progress.highestUnlockedLevel;
  }

  isLevelCompleted(level: number): boolean {
    return this.progress.levelScores[level]?.completed === true;
  }

  getLevelScore(level: number): LevelScore | undefined {
    return this.progress.levelScores[level];
  }

  unlockLevel(level: number): void {
    if (level > this.progress.highestUnlockedLevel) {
      this.progress.highestUnlockedLevel = level;
    }
    this.save();
  }

  setLevelScore(level: number, score: LevelScore): void {
    const existing = this.progress.levelScores[level];
    if (existing) {
      // Keep best scores
      this.progress.levelScores[level] = {
        completed: true,
        starsCollected: Math.max(existing.starsCollected, score.starsCollected),
        coinsCollected: Math.max(existing.coinsCollected, score.coinsCollected),
        totalStars: score.totalStars,
        totalCoins: score.totalCoins,
        bestTimeSeconds: Math.min(
          existing.bestTimeSeconds,
          score.bestTimeSeconds
        ),
      };
    } else {
      this.progress.levelScores[level] = { ...score, completed: true };
    }
    this.save();
  }

  resetProgress(): void {
    this.progress = { ...DEFAULT_PROGRESS, levelScores: {} };
    this.save();
  }
}
