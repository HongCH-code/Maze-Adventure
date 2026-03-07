import { MazeCell, Position } from "../types";

// Seeded random number generator (mulberry32)
function seededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MazeGenerator {
  /**
   * Generate a maze using recursive backtracker (DFS).
   * Grid dimensions should be odd numbers for proper wall alignment.
   * Returns a 2D array where each cell knows its type and wall state.
   */
  static generate(
    width: number,
    height: number,
    seed: number,
    start: Position,
    exit: Position
  ): MazeCell[][] {
    const rng = seededRandom(seed);

    // Initialize grid: all walls
    const grid: MazeCell[][] = [];
    for (let y = 0; y < height; y++) {
      grid[y] = [];
      for (let x = 0; x < width; x++) {
        grid[y][x] = {
          x,
          y,
          type: "wall",
          walls: { north: true, south: true, east: true, west: true },
        };
      }
    }

    // Carve maze using DFS on odd-coordinate cells
    // Cells at odd x,y are "rooms", even positions are walls/corridors
    const cellWidth = Math.floor((width - 1) / 2);
    const cellHeight = Math.floor((height - 1) / 2);

    const visited: boolean[][] = [];
    for (let y = 0; y < cellHeight; y++) {
      visited[y] = [];
      for (let x = 0; x < cellWidth; x++) {
        visited[y][x] = false;
      }
    }

    // Convert cell coordinates to grid coordinates
    const toGrid = (cx: number, cy: number): Position => ({
      x: cx * 2 + 1,
      y: cy * 2 + 1,
    });

    const directions = [
      { dx: 0, dy: -1, name: "north" as const, opposite: "south" as const },
      { dx: 0, dy: 1, name: "south" as const, opposite: "north" as const },
      { dx: 1, dy: 0, name: "east" as const, opposite: "west" as const },
      { dx: -1, dy: 0, name: "west" as const, opposite: "east" as const },
    ];

    // Shuffle array using seeded RNG
    const shuffle = <T>(arr: T[]): T[] => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    // DFS iterative to avoid stack overflow on large mazes
    const stack: Position[] = [];
    const startCell: Position = { x: 0, y: 0 };
    visited[startCell.y][startCell.x] = true;
    const startGrid = toGrid(startCell.x, startCell.y);
    grid[startGrid.y][startGrid.x].type = "path";
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = shuffle(directions).filter((d) => {
        const nx = current.x + d.dx;
        const ny = current.y + d.dy;
        return (
          nx >= 0 &&
          nx < cellWidth &&
          ny >= 0 &&
          ny < cellHeight &&
          !visited[ny][nx]
        );
      });

      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }

      const dir = neighbors[0];
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;

      visited[ny][nx] = true;

      // Carve the neighbor cell
      const neighborGrid = toGrid(nx, ny);
      grid[neighborGrid.y][neighborGrid.x].type = "path";

      // Carve the wall between current and neighbor
      const wallX = toGrid(current.x, current.y).x + dir.dx;
      const wallY = toGrid(current.x, current.y).y + dir.dy;
      grid[wallY][wallX].type = "path";

      // Update wall flags
      const currentGrid = toGrid(current.x, current.y);
      grid[currentGrid.y][currentGrid.x].walls[dir.name] = false;
      grid[neighborGrid.y][neighborGrid.x].walls[dir.opposite] = false;

      stack.push({ x: nx, y: ny });
    }

    // Ensure start and exit are on path cells
    // Map start/exit to nearest valid cell coordinates
    const ensurePath = (pos: Position): Position => {
      const cx = Math.max(0, Math.min(Math.floor(pos.x / 2), cellWidth - 1));
      const cy = Math.max(0, Math.min(Math.floor(pos.y / 2), cellHeight - 1));
      return toGrid(cx, cy);
    };

    const startPos = ensurePath(start);
    const exitPos = ensurePath(exit);

    grid[startPos.y][startPos.x].type = "start";
    grid[exitPos.y][exitPos.x].type = "exit";

    return grid;
  }

  /**
   * Check if a path exists from start to exit using BFS.
   */
  static isSolvable(grid: MazeCell[][]): boolean {
    const height = grid.length;
    const width = grid[0].length;

    let start: Position | null = null;
    let exit: Position | null = null;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x].type === "start") start = { x, y };
        if (grid[y][x].type === "exit") exit = { x, y };
      }
    }

    if (!start || !exit) return false;

    const visited = new Set<string>();
    const queue: Position[] = [start];
    visited.add(`${start.x},${start.y}`);

    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.x === exit.x && current.y === exit.y) return true;

      for (const dir of dirs) {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        const key = `${nx},${ny}`;

        if (
          nx >= 0 &&
          nx < width &&
          ny >= 0 &&
          ny < height &&
          !visited.has(key) &&
          grid[ny][nx].type !== "wall"
        ) {
          visited.add(key);
          queue.push({ x: nx, y: ny });
        }
      }
    }

    return false;
  }
}
