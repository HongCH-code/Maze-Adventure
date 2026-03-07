# Research: Maze Puzzle Game

**Date**: 2026-03-06
**Feature**: 001-maze-puzzle-game

## Decision 1: Game Engine — Phaser 3

**Decision**: Use Phaser 3 as the game engine.

**Rationale**: Phaser 3 is the most mature and widely adopted 2D game framework for the browser. It provides built-in support for sprite rendering, tilemaps, animation, physics, input handling (keyboard + touch), audio, and scene management — all requirements for this project. Its Scale Manager handles responsive resizing out of the box.

**Alternatives considered**:
- **PixiJS**: Lower-level rendering library. Would require building scene management, input handling, and game loop from scratch. More effort for the same result.
- **Kaboom.js**: Simpler API but less mature, smaller community, fewer examples for tilemap-based games.
- **Raw Canvas API**: Maximum control but enormous boilerplate for features Phaser provides out of the box. Not justified for this scope.

## Decision 2: Maze Generation Algorithm — Recursive Backtracker (DFS)

**Decision**: Use recursive backtracker (depth-first search) for procedural maze generation, with hand-tuned overrides per level for puzzle gate and item placement.

**Rationale**: Recursive backtracker produces mazes with long, winding corridors and a single solution path — ideal for a children's game where getting lost is part of the fun but the maze is always solvable. The algorithm is simple to implement and well-documented.

**Alternatives considered**:
- **Prim's algorithm**: Produces mazes with many short dead ends. Less satisfying navigation feel for this game style.
- **Kruskal's algorithm**: Similar output to Prim's. No advantage over recursive backtracker for this use case.
- **Fully hand-designed mazes**: Would require designing 20 mazes manually. The hybrid approach (generated maze + hand-placed gates/items) gives the best balance of effort and quality.

**Implementation detail**: Each level JSON defines grid size, difficulty tier, number of puzzle gates, item placements, and an optional seed for reproducible generation. The generator uses the seed to create the maze, then the level data specifies where gates and items are injected into the generated paths.

## Decision 3: Level Data Format — JSON Files

**Decision**: Define each level as a standalone JSON file (`level-01.json` through `level-20.json`).

**Rationale**: JSON is natively supported by TypeScript/Phaser, easy to validate, and can be loaded asynchronously. Separating level data from code ensures the Extensible Architecture principle is satisfied — new levels can be added by dropping a new JSON file without touching game logic.

**Alternatives considered**:
- **Tiled Map Editor (.tmx)**: Powerful but adds a tool dependency and learning curve. Overkill for grid-based mazes that can be described with a simple JSON schema.
- **Hardcoded arrays in TypeScript**: Violates the data-driven principle from the constitution.
- **YAML**: Requires a parser dependency. No advantage over JSON for this data complexity.

**Level JSON schema**:
```json
{
  "level": 1,
  "gridWidth": 8,
  "gridHeight": 8,
  "seed": 12345,
  "difficultyTier": 1,
  "puzzleGates": [],
  "items": [],
  "startPosition": { "x": 0, "y": 0 },
  "exitPosition": { "x": 7, "y": 7 }
}
```

## Decision 4: Puzzle System — Registry with Math Generator

**Decision**: Implement a puzzle type registry where each puzzle type (addition, subtraction, counting, comparison) is a registered generator function. The `PuzzleManager` selects a puzzle type based on level difficulty tier and generates a question with randomized operands.

**Rationale**: The registry pattern satisfies the constitution's pluggability requirement. New puzzle types (e.g., shape recognition) can be added by registering a new generator without modifying existing code.

**Alternatives considered**:
- **Static question pools**: Pre-authored questions per level. Limited variety and requires manual authoring of hundreds of questions.
- **Single monolithic generator**: Would work but becomes hard to maintain as puzzle types grow.

**Difficulty tier mapping**:
| Tier | Levels | Operations | Number Range |
|------|--------|-----------|--------------|
| 1 | 1-5 | Addition only | 1-10 |
| 2 | 6-10 | Addition, subtraction | 1-15 |
| 3 | 11-15 | Addition, subtraction, counting | 1-18 |
| 4 | 16-20 | All operations + comparison | 1-20 |

## Decision 5: State Persistence — localStorage

**Decision**: Use browser localStorage for persisting player progress (levels completed, best scores, items collected).

**Rationale**: The game is single-player with no account system. localStorage is synchronous, universally supported, and requires no backend. Data is keyed by a single JSON object (`maze-adventure-progress`).

**Alternatives considered**:
- **IndexedDB**: Asynchronous and more complex API. Overkill for the small amount of data being stored (<1KB).
- **Cookies**: Size-limited and sent with HTTP requests. Not appropriate for game state.
- **No persistence**: Poor UX — players would lose progress on every session.

## Decision 6: PWA Strategy — vite-plugin-pwa

**Decision**: Use `vite-plugin-pwa` with Workbox to auto-generate the service worker and manifest.

**Rationale**: This plugin integrates directly with the Vite build pipeline, generates precache manifests for all game assets, and handles service worker registration. It requires minimal configuration and produces a fully offline-capable PWA.

**Alternatives considered**:
- **Manual service worker**: Full control but significant boilerplate for cache versioning, update flows, and asset manifests.
- **Capacitor/Cordova**: Native wrapper approach. Adds complexity and build steps. A PWA is sufficient for the target use case (installable via browser, offline play).

## Decision 7: Responsive Scaling — Phaser Scale Manager (FIT mode)

**Decision**: Use Phaser's built-in Scale Manager in `FIT` mode with a fixed game resolution (e.g., 800x600) that scales to fill the viewport while maintaining aspect ratio.

**Rationale**: FIT mode ensures the game looks correct on any screen size without distortion. Black bars (letterboxing) appear on mismatched aspect ratios, which is acceptable and simpler than redesigning layouts per device.

**Alternatives considered**:
- **RESIZE mode**: Dynamically adjusts game resolution to viewport. Would require all UI elements to use relative positioning, significantly increasing complexity.
- **ENVELOP mode**: Crops edges to fill viewport. Could hide important game elements on narrow screens.

## Decision 8: Input Handling — Dual Input with Virtual D-Pad

**Decision**: Support keyboard arrow keys for desktop and a virtual D-pad overlay for mobile. The InputManager abstracts both into directional commands consumed by the player movement system.

**Rationale**: A virtual D-pad is more reliable than swipe gestures for grid-based movement in a maze. Children can see and tap clear directional buttons. Swipe detection is error-prone on small screens.

**Alternatives considered**:
- **Swipe-only on mobile**: Harder for young children to execute precisely. Grid-based movement needs discrete directional input, not continuous gestures.
- **Tap-to-move**: Player taps a destination cell and the character pathfinds. Removes the exploration aspect of maze navigation.
