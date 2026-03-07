export interface LeaderboardEntry {
  name: string;
  timeSeconds: number;
  coins: number;
}

const MAX_ENTRIES = 5;
const STORAGE_KEY = "maze-adventure-leaderboard";

export class LeaderboardManager {
  private getAll(): Record<string, LeaderboardEntry[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private saveAll(data: Record<string, LeaderboardEntry[]>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  getLeaderboard(level: number): LeaderboardEntry[] {
    return this.getAll()[`lv${level}`] || [];
  }

  /** Check if a score qualifies for the top 5 */
  qualifies(level: number, timeSeconds: number, coins: number): boolean {
    const lb = this.getLeaderboard(level);
    if (lb.length < MAX_ENTRIES) return true;
    const worst = lb[lb.length - 1];
    if (timeSeconds < worst.timeSeconds) return true;
    if (timeSeconds === worst.timeSeconds && coins > worst.coins) return true;
    return false;
  }

  /** Insert entry and return 1-based rank, or -1 if didn't qualify */
  addEntry(
    level: number,
    name: string,
    timeSeconds: number,
    coins: number
  ): number {
    const all = this.getAll();
    const key = `lv${level}`;
    const lb = all[key] || [];

    let rank = lb.length;
    for (let i = 0; i < lb.length; i++) {
      if (
        timeSeconds < lb[i].timeSeconds ||
        (timeSeconds === lb[i].timeSeconds && coins > lb[i].coins)
      ) {
        rank = i;
        break;
      }
    }

    if (rank >= MAX_ENTRIES) return -1;

    lb.splice(rank, 0, { name, timeSeconds, coins });
    all[key] = lb.slice(0, MAX_ENTRIES);
    this.saveAll(all);
    return rank + 1;
  }
}
