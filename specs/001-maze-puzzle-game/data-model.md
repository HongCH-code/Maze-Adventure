# Data Model: Maze Puzzle Game

**Date**: 2026-03-06
**Feature**: 001-maze-puzzle-game

## Entities

### Level

Represents a single maze stage defined as a JSON data file.

| Field | Type | Description |
|-------|------|-------------|
| level | number (1-20) | Level number, determines unlock order |
| gridWidth | number | Maze grid width in cells |
| gridHeight | number | Maze grid height in cells |
| seed | number | Random seed for reproducible maze generation |
| difficultyTier | number (1-4) | Controls puzzle difficulty and maze complexity |
| puzzleGates | PuzzleGate[] | List of locked gate positions and associated puzzle config |
| items | ItemPlacement[] | List of item spawn points |
| startPosition | Position | Player starting cell |
| exitPosition | Position | Maze exit cell |

**Validation rules**:
- `level` MUST be unique across all level files (1 through 20)
- `gridWidth` and `gridHeight` MUST be odd numbers (required by maze generation algorithm to ensure walls align to grid)
- `difficultyTier` MUST match the level range: levels 1-5 = tier 1, 6-10 = tier 2, 11-15 = tier 3, 16-20 = tier 4
- `startPosition` and `exitPosition` MUST be on walkable cells after maze generation

### MazeCell

Represents a single cell in the generated maze grid. Not stored in JSON — computed at runtime from the seed.

| Field | Type | Description |
|-------|------|-------------|
| x | number | Column index |
| y | number | Row index |
| type | CellType | wall, path, start, exit |
| content | CellContent or null | gate, item, or empty |

**State transitions**:
- `gate (locked)` → `gate (unlocked)`: when player solves the associated puzzle
- `item (present)` → `item (collected)`: when player walks over the item cell

### PuzzleGate

Defines a locked gate within a level.

| Field | Type | Description |
|-------|------|-------------|
| position | Position | Cell position of the gate |
| puzzleType | string | Puzzle category: "addition", "subtraction", "counting", "comparison" |
| difficulty | number (1-4) | Matches the level's difficulty tier |

### ItemPlacement

Defines an item spawn point within a level.

| Field | Type | Description |
|-------|------|-------------|
| position | Position | Cell position of the item |
| itemType | string | Item category: "star", "coin", "key" |
| requiredForGate | string or null | If type is "key", references which locked door it opens (door ID) |

### Puzzle

A generated math question presented to the player at a gate. Created at runtime by the PuzzleManager.

| Field | Type | Description |
|-------|------|-------------|
| question | string | Display text (e.g., "3 + 4 = ?") |
| correctAnswer | number | The correct numeric answer |
| choices | number[] | Array of 3-4 answer options (includes correct answer, shuffled) |
| puzzleType | string | Which generator created this puzzle |

**Validation rules**:
- `choices` MUST always include `correctAnswer`
- `choices` MUST contain no duplicates
- All numbers in `choices` MUST be non-negative and ≤ 20
- `correctAnswer` MUST be non-negative and ≤ 20

### PlayerProgress

Persisted in localStorage as a single JSON object.

| Field | Type | Description |
|-------|------|-------------|
| highestUnlockedLevel | number | The highest level the player can access (starts at 1) |
| levelScores | Record<number, LevelScore> | Best score per completed level |

### LevelScore

Score record for a single completed level.

| Field | Type | Description |
|-------|------|-------------|
| completed | boolean | Whether the level has been finished |
| starsCollected | number | Best count of stars collected |
| coinsCollected | number | Best count of coins collected |
| totalStars | number | Total stars available in the level |
| totalCoins | number | Total coins available in the level |
| bestTimeSeconds | number | Fastest completion time in seconds |

## Relationships

```text
Level (1) ──contains──> (N) PuzzleGate
Level (1) ──contains──> (N) ItemPlacement
Level (1) ──generates──> (1) Maze (grid of MazeCells)
PuzzleGate (1) ──generates at runtime──> (1) Puzzle
ItemPlacement (key) ──unlocks──> (1) Locked door (by door ID)
PlayerProgress (1) ──tracks──> (N) LevelScore
```

## Shared Types

```typescript
interface Position {
  x: number;
  y: number;
}

type CellType = "wall" | "path" | "start" | "exit";

type CellContent = "gate" | "item";

type ItemType = "star" | "coin" | "key";

type PuzzleType = "addition" | "subtraction" | "counting" | "comparison";

type DifficultyTier = 1 | 2 | 3 | 4;
```
