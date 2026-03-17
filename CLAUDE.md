# Maze-Adventure Development Guidelines

Last updated: 2026-03-17

## Active Technologies

- TypeScript 5.x (strict mode) + Phaser 3.90 (game engine), Vite (build tool), vite-plugin-pwa (PWA support)
- No test framework in active use (vitest configured but tests/ is empty)

## Project Structure

```text
src/
├── main.ts                      # Phaser game entry point (800×600, 9 scenes)
├── types/index.ts               # All shared types (LevelData, PuzzleType, etc.)
├── scenes/
│   ├── BootScene.ts             # Asset loading + procedural texture generation
│   ├── ProfileSelectScene.ts    # Player profile selection (3 slots)
│   ├── TitleScene.ts            # Title screen
│   ├── LevelSelectScene.ts     # Level grid (TOTAL_LEVELS = 80, 20/page)
│   ├── GameScene.ts             # Core game loop (~1600 lines)
│   ├── PuzzleScene.ts           # Quiz overlay (launched from GameScene)
│   ├── BattleScene.ts           # Battle overlay (timing bar + dodge)
│   ├── LevelCompleteScene.ts    # Results + leaderboard
│   └── HowToPlayScene.ts       # Paginated tutorial (3 pages)
├── systems/
│   ├── MazeGenerator.ts         # Seeded DFS maze generation
│   ├── PuzzleManager.ts         # 16 puzzle type generators
│   ├── InputManager.ts          # Keyboard + touch D-pad
│   ├── MobileInput.ts           # HTML input for mobile keyboard
│   ├── ProgressManager.ts       # localStorage progress tracking
│   ├── ProfileManager.ts        # Multi-profile management
│   ├── SoundManager.ts          # Procedural Web Audio sfx
│   ├── MusicManager.ts          # BGM playback
│   ├── LeaderboardManager.ts    # Per-level leaderboard
│   └── ItemRegistry.ts          # Item ID registry
└── data/levels/
    └── level-01.json ... level-80.json  # Static level configurations
```

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc + vite build
npm test          # vitest run (currently no tests)
```

## Code Style

- TypeScript strict mode, follow existing patterns
- Commit messages in English
- Code comments in English
- UI text in Traditional Chinese

## Theme System

Three themes based on level range, controlled by `isOceanLevel()` / `isJungleLevel()` in GameScene:

| Theme | Levels | Texture prefix | BGM key |
|-------|--------|---------------|---------|
| Standard | 1-50 | (default) | bgm_standard |
| Ocean | 51-65 | ocean_ | bgm_ocean |
| Jungle | 66-80 | jungle_ | bgm_jungle |

Use `getThemeTexture(standard, ocean, jungle)` helper for all texture selections — do NOT use inline ternary chains.

## Key Patterns

- **Level data**: Static JSON imports in GameScene, registered in `LEVEL_MAP`. Grid coords use odd numbers (1,3,5...).
- **Overlay scenes**: PuzzleScene and BattleScene are launched via `scene.launch()`, communicate back via `events.emit()` + `scene.stop()`. Always call `events.off()` before `events.on()` to prevent listener accumulation on scene restart.
- **Textures**: All generated programmatically in BootScene (no image assets except player/start/exit sprites).
- **New level fields**: `vineBridges`, `patrolAnimals`, `boss` are optional fields on `LevelData` — access directly (no `as any` casts needed).
- **Patrol animals**: Move tile-by-tile with per-step collision detection. Use `buildPatrolSteps()` + `moveAnimalStep()`.
- **Constants**: `TOTAL_LEVELS` is in LevelSelectScene.ts — import it, don't hardcode.

## Recent Changes

- Jungle Adventure theme (levels 66-80): vine bridges (5-use), patrol animals, turn-based battle system (timing bar attack + direction dodge defense), Level 80 boss
- Ocean World theme (levels 51-65): water currents, fog zones, ocean creature puzzles
- 16 puzzle types including directionPuzzle, patternSequence, lifeSafety, oceanCreature
- Paginated how-to-play with per-theme pages
