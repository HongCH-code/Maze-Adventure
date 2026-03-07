export interface UserProfile {
  name: string;
  createdAt: number;
}

const PROFILES_KEY = "maze-adventure-profiles";
const ACTIVE_KEY = "maze-adventure-active-slot";
const TOTAL_SLOTS = 3;

const OLD_PROGRESS_KEY = "maze-adventure-progress";

class ProfileManagerSingleton {
  constructor() {
    // Migrate old single-profile progress to slot 0
    this.migrateOldProgress();
  }

  private migrateOldProgress(): void {
    try {
      const oldData = localStorage.getItem(OLD_PROGRESS_KEY);
      if (!oldData) return;
      // Only migrate if slot 0 has no progress yet
      const slot0Key = this.progressKeyFor(0);
      if (localStorage.getItem(slot0Key)) return;
      // Create profile for slot 0 if none exists
      const profiles = this.getProfiles();
      if (!profiles[0]) {
        profiles[0] = { name: "玩家1", createdAt: Date.now() };
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      }
      localStorage.setItem(slot0Key, oldData);
      localStorage.removeItem(OLD_PROGRESS_KEY);
    } catch {
      // ignore migration errors
    }
  }

  getProfiles(): (UserProfile | null)[] {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as (UserProfile | null)[];
        if (Array.isArray(arr) && arr.length === TOTAL_SLOTS) return arr;
      }
    } catch {
      // corrupted
    }
    return [null, null, null];
  }

  private saveProfiles(profiles: (UserProfile | null)[]): void {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }

  getActiveSlot(): number | null {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (raw === null) return null;
    const slot = parseInt(raw, 10);
    if (slot >= 0 && slot < TOTAL_SLOTS) return slot;
    return null;
  }

  setActiveSlot(slot: number): void {
    localStorage.setItem(ACTIVE_KEY, String(slot));
  }

  getActiveProfile(): UserProfile | null {
    const slot = this.getActiveSlot();
    if (slot === null) return null;
    return this.getProfiles()[slot] ?? null;
  }

  createProfile(slot: number, name: string): void {
    const profiles = this.getProfiles();
    profiles[slot] = { name, createdAt: Date.now() };
    this.saveProfiles(profiles);
  }

  deleteProfile(slot: number): void {
    const profiles = this.getProfiles();
    profiles[slot] = null;
    this.saveProfiles(profiles);
    // Also clear progress for this slot
    localStorage.removeItem(this.progressKeyFor(slot));
    // If this was active, clear active
    if (this.getActiveSlot() === slot) {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }

  /** Storage key for ProgressManager based on slot */
  progressKeyFor(slot: number): string {
    return `maze-adventure-progress-${slot}`;
  }

  /** Storage key for the currently active profile */
  getActiveProgressKey(): string {
    const slot = this.getActiveSlot();
    if (slot === null) return "maze-adventure-progress-0";
    return this.progressKeyFor(slot);
  }

  /** Count completed levels for a given slot */
  getCompletedCount(slot: number): number {
    try {
      const key = this.progressKeyFor(slot);
      const raw = localStorage.getItem(key);
      if (!raw) return 0;
      const data = JSON.parse(raw);
      if (!data.levelScores) return 0;
      return Object.values(data.levelScores).filter(
        (s: any) => s.completed
      ).length;
    } catch {
      return 0;
    }
  }

  /** Get highest unlocked level for a given slot */
  getHighestLevel(slot: number): number {
    try {
      const key = this.progressKeyFor(slot);
      const raw = localStorage.getItem(key);
      if (!raw) return 1;
      const data = JSON.parse(raw);
      return data.highestUnlockedLevel || 1;
    } catch {
      return 1;
    }
  }
}

export const profileManager = new ProfileManagerSingleton();
