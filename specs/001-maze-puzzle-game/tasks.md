# Tasks: Maze Puzzle Game

**Input**: Design documents from `/specs/001-maze-puzzle-game/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Project initialization, dependencies, and shared types

- [x] T001 Initialize Vite + TypeScript project with Phaser 3 dependency in package.json and tsconfig.json (strict mode)
- [x] T002 Create project directory structure: src/scenes/, src/systems/, src/data/levels/, src/data/puzzles/, src/assets/sprites/, src/assets/tilemaps/, src/assets/audio/, src/types/, tests/, public/
- [x] T003 [P] Define shared TypeScript interfaces and types (Position, CellType, CellContent, ItemType, PuzzleType, DifficultyTier, LevelData, PuzzleGateData, ItemPlacementData, PlayerProgress, LevelScore) in src/types/index.ts
- [x] T004 [P] Create Phaser game configuration and bootstrap entry point in src/main.ts with Scale Manager (FIT mode, 800x600 base resolution), scene registration, and parent container binding
- [x] T005 [P] Create public/index.html with game container div and viewport meta tag for mobile

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core systems that ALL user stories depend on

- [x] T006 Implement MazeGenerator (recursive backtracker / DFS) in src/systems/MazeGenerator.ts — accepts grid width, height, and seed; returns a 2D grid of MazeCell objects; ensures start and exit positions are on walkable cells
- [x] T007 [P] Implement ProgressManager in src/systems/ProgressManager.ts — read/write PlayerProgress to localStorage under key "maze-adventure-progress"; methods: load(), save(), unlockLevel(n), setLevelScore(n, score), getProgress(), resetProgress()
- [x] T008 [P] Implement BootScene in src/scenes/BootScene.ts — preload all game assets (sprites, audio), show a loading bar, transition to TitleScene on complete
- [x] T009 Create placeholder sprite assets in src/assets/sprites/ — wall tile, path tile, player character, start marker, exit marker (simple colored rectangles or basic shapes are sufficient for MVP)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 - Navigate and Complete a Maze Level (Priority: P1)

**Goal**: Player can select a level, navigate through a maze, reach the exit, and unlock the next level

**Independent Test**: Launch the game, enter Level 1, navigate from start to exit with arrow keys, see level-complete screen, confirm Level 2 unlocks

### Implementation for User Story 1

- [x] T010 [US1] Create TitleScene in src/scenes/TitleScene.ts — display game title and a "Play" button; transition to LevelSelectScene on tap/click
- [x] T011 [US1] Create LevelSelectScene (basic version) in src/scenes/LevelSelectScene.ts — display 20 level buttons in a grid; show locked/unlocked state based on ProgressManager; tap unlocked level to start GameScene with level number
- [x] T012 [US1] Create level-01.json in src/data/levels/ — small 9x9 maze, difficultyTier 1, no puzzle gates, no items, define start and exit positions
- [x] T013 [US1] Create level-02.json and level-03.json in src/data/levels/ — slightly larger mazes (9x9 and 11x11), difficultyTier 1, no puzzle gates, no items
- [x] T014 [US1] Implement GameScene (maze rendering) in src/scenes/GameScene.ts — load level JSON by level number, run MazeGenerator with seed, render maze grid as tilemap (walls and paths), place start and exit markers
- [x] T015 [US1] Implement player movement in src/scenes/GameScene.ts — spawn player sprite at start position, handle arrow key input for grid-based movement (one cell at a time), prevent movement into walls, animate smooth movement between cells
- [x] T016 [US1] Implement exit detection in src/scenes/GameScene.ts — when player reaches exit cell, stop input, play a brief completion effect, calculate time taken, transition to LevelCompleteScene
- [x] T017 [US1] Create LevelCompleteScene in src/scenes/LevelCompleteScene.ts — display "Level Complete!" message and time taken, show "Next Level" button (unlocks and navigates to next level) and "Level Select" button, call ProgressManager.unlockLevel() and setLevelScore()
- [x] T018 [US1] Implement pause functionality in src/scenes/GameScene.ts — add a pause button (top corner), show pause overlay with "Resume" and "Quit" options, "Quit" returns to LevelSelectScene

**Checkpoint**: User Story 1 fully functional — player can navigate mazes and progress through levels

---

## Phase 4: User Story 2 - Solve Math Puzzles to Progress (Priority: P2)

**Goal**: Locked gates in the maze require solving a math puzzle to pass

**Independent Test**: Navigate to a gate in a maze, see puzzle overlay, answer correctly to open gate, answer incorrectly to see retry feedback

### Implementation for User Story 2

- [x] T019 [US2] Implement PuzzleManager in src/systems/PuzzleManager.ts — puzzle type registry with generate(type, difficulty) method; register 4 generator functions: addition (a + b = ?), subtraction (a - b = ?, result ≥ 0), counting ("How many X?"), comparison (a > b, true/false mapped to choices); each generator returns a Puzzle object with question, correctAnswer, and 3-4 shuffled choices; respect difficulty tier number ranges (tier 1: 1-10, tier 2: 1-15, tier 3: 1-18, tier 4: 1-20)
- [x] T020 [P] [US2] Create placeholder gate sprite in src/assets/sprites/ — locked gate and unlocked gate visuals
- [x] T021 [US2] Render puzzle gates in GameScene in src/scenes/GameScene.ts — read puzzleGates from level JSON, place gate sprites on specified cells, block player movement into locked gate cells
- [x] T022 [US2] Create PuzzleScene overlay in src/scenes/PuzzleScene.ts — launched as an overlay scene on top of GameScene when player interacts with a locked gate; display question text (large font), 3-4 answer choice buttons (large, tappable); on correct answer: play positive feedback, close overlay, emit "gate-unlocked" event; on incorrect answer: play gentle "try again" animation, allow retry with no penalty
- [x] T023 [US2] Integrate gate unlocking in src/scenes/GameScene.ts — listen for "gate-unlocked" event from PuzzleScene, update gate cell to unlocked state (change sprite, allow passage), persist gate state for current level session
- [x] T024 [US2] Update level-02.json and level-03.json in src/data/levels/ to include 1 puzzle gate each (addition type, difficulty tier 1)
- [x] T025 [US2] Create level-04.json and level-05.json in src/data/levels/ — 11x11 mazes, difficultyTier 1, 1 puzzle gate each

**Checkpoint**: User Story 2 functional — puzzles block progress and can be solved

---

## Phase 5: User Story 3 - Collect Items in the Maze (Priority: P3)

**Goal**: Stars, coins, and keys are collectible; keys unlock specific doors; HUD shows collection status; scores tracked

**Independent Test**: Enter a level with items, walk over items to collect, see HUD update, confirm score on level-complete screen

### Implementation for User Story 3

- [x] T026 [US3] Implement ItemRegistry in src/systems/ItemRegistry.ts — registry of item types (star, coin, key) with definitions: sprite key, score value, isRequired flag; methods: register(type, definition), getDefinition(type), getAllTypes()
- [x] T027 [P] [US3] Create item sprites in src/assets/sprites/ — star, coin, key visuals (simple but distinct colored shapes)
- [x] T028 [US3] Render items in GameScene in src/scenes/GameScene.ts — read items array from level JSON, place item sprites on specified cells using ItemRegistry definitions
- [x] T029 [US3] Implement item collection in src/scenes/GameScene.ts — detect player overlap with item cells, remove item sprite with collect animation (scale + fade), play collect sound, track collected items in scene state, increment HUD counter
- [x] T030 [US3] Implement key-door mechanic in src/scenes/GameScene.ts — render locked doors (distinct from puzzle gates), check player inventory for required key when approaching a locked door, auto-open door if key is held, block passage if key not collected
- [x] T031 [US3] Create HUD overlay in src/scenes/GameScene.ts — display star count, coin count, key count in top area of screen; update counters in real-time as items are collected
- [x] T032 [US3] Update LevelCompleteScene in src/scenes/LevelCompleteScene.ts — show items collected vs total available (e.g., "Stars: 3/5"), update best score in ProgressManager if current run has more items
- [x] T033 [US3] Create locked door sprite in src/assets/sprites/ — visually distinct from puzzle gates
- [x] T034 [US3] Update level-03.json through level-05.json in src/data/levels/ to include item placements (stars, coins) and at least one key+door pair in level-05

**Checkpoint**: User Story 3 functional — items collectible, keys open doors, scores tracked

---

## Phase 6: User Story 4 - Progressive Level System (Priority: P4)

**Goal**: All 20 levels designed with progressive difficulty; level select shows full progress

**Independent Test**: Play levels 1, 5, 10, 15, 20 and confirm maze size, puzzle frequency, and complexity increase at each stage

### Implementation for User Story 4

- [x] T035 [P] [US4] Create level-06.json through level-10.json in src/data/levels/ — grid sizes 11x11 to 15x15, difficultyTier 2, 1-2 puzzle gates (addition + subtraction), 3-5 items with 1 key+door pair
- [x] T036 [P] [US4] Create level-11.json through level-15.json in src/data/levels/ — grid sizes 15x15 to 19x19, difficultyTier 3, 2-3 puzzle gates (addition + subtraction + counting), 5-8 items with 1-2 key+door pairs
- [x] T037 [P] [US4] Create level-16.json through level-20.json in src/data/levels/ — grid sizes 19x19 to 25x25, difficultyTier 4, 3-4 puzzle gates (all types), 8-12 items with 2-3 key+door pairs
- [x] T038 [US4] Enhance LevelSelectScene in src/scenes/LevelSelectScene.ts — show completed levels with checkmark icon and best score, display star rating or item collection summary per level, scroll or paginate if 20 levels don't fit on screen
- [x] T039 [US4] Validate all 20 levels are solvable — run MazeGenerator with each level's seed and verify start-to-exit path exists after placing gates and items; log any issues

**Checkpoint**: All 20 levels playable with progressive difficulty curve

---

## Phase 7: User Story 5 - Play on Mobile Devices (Priority: P5)

**Goal**: Touch controls, responsive layout, PWA installability, offline support

**Independent Test**: Open on mobile browser, install to home screen, play a level with touch controls, verify smooth performance

### Implementation for User Story 5

- [x] T040 [US5] Implement InputManager in src/systems/InputManager.ts — abstract input layer that emits directional commands (up/down/left/right); detect device type (touch vs keyboard); on desktop: listen for arrow key events; on mobile: render virtual D-pad overlay
- [x] T041 [US5] Create virtual D-pad UI in src/systems/InputManager.ts — render 4 directional buttons (up/down/left/right) as semi-transparent overlays in bottom-right area of screen; handle touch events on each button; debounce rapid taps to prevent double-moves
- [x] T042 [US5] Integrate InputManager into GameScene in src/scenes/GameScene.ts — replace direct keyboard input with InputManager directional commands; ensure both keyboard and touch work seamlessly
- [x] T043 [US5] Configure responsive scaling in src/main.ts — ensure Phaser Scale Manager FIT mode works correctly on mobile; set autoCenter to CENTER_BOTH; handle orientation change events; add minimum-size warning for screens < 320px width
- [x] T044 [US5] Configure PWA manifest in public/manifest.json — set app name, short name, icons (generate from game assets), start_url, display: standalone, theme_color, background_color, orientation: any
- [x] T045 [US5] Configure vite-plugin-pwa in vite.config.ts — enable service worker generation with Workbox precaching for all assets in src/assets/ and public/; configure offline fallback; set runtime caching strategy for level JSON files
- [x] T046 [US5] Create PWA icons in public/ — generate app icons at required sizes (192x192, 512x512) from game branding
- [x] T047 [US5] Ensure all UI elements are touch-friendly — verify button sizes are at least 44x44px, add adequate spacing between interactive elements, test all scenes (Title, LevelSelect, Game, Puzzle, LevelComplete) for tap accuracy

**Checkpoint**: Game fully playable on mobile with touch controls and installable as PWA

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Audio, animations, visual polish, and final quality improvements

- [x] T048 [P] Add sound effects in src/assets/audio/ and integrate into scenes — collect item sound, correct answer chime, incorrect answer buzz, level complete fanfare, gate open sound, player movement step sound
- [x] T049 [P] Add animations across all scenes — player walk cycle, item collect (sparkle + scale), gate unlock (slide open), level complete (stars/confetti), puzzle correct (green flash), puzzle incorrect (gentle shake)
- [x] T050 Implement smooth camera follow in src/scenes/GameScene.ts — for larger mazes (level 6+), camera follows the player with the maze scrolling; clamp camera to maze bounds
- [x] T051 [P] Add visual polish to TitleScene in src/scenes/TitleScene.ts — game logo/title art, simple background animation, version number display
- [x] T052 [P] Add visual polish to LevelSelectScene in src/scenes/LevelSelectScene.ts — level map with path/trail connecting levels, animated unlock transitions, difficulty tier visual indicators
- [x] T053 Performance validation — test all 20 levels on desktop and mobile; verify 60fps maintained; identify and optimize any rendering bottlenecks on larger mazes (level 16-20)
- [x] T054 Edge case handling — implement rapid-tap debounce on puzzle answers, handle localStorage cleared gracefully (reset to fresh state), handle browser force-close mid-level (progress for current level lost, saved progress preserved)
- [x] T055 Final playtest of all 20 levels end-to-end — verify every level is solvable, every puzzle has correct answer in choices, every key unlocks its corresponding door, difficulty curve feels appropriate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types and project config)
- **User Story 1 (Phase 3)**: Depends on Phase 2 (MazeGenerator, ProgressManager, BootScene, assets)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (GameScene with maze rendering and player movement)
- **User Story 3 (Phase 5)**: Depends on Phase 3 (GameScene with movement and collision); can run in parallel with US2 if needed
- **User Story 4 (Phase 6)**: Depends on US2 and US3 (levels need puzzle gates and items)
- **User Story 5 (Phase 7)**: Depends on Phase 3 (working GameScene); can start after US1, but ideally after US3 to test full feature set
- **Polish (Phase 8)**: Depends on all user stories complete

### Parallel Opportunities

- T003, T004, T005 can run in parallel (types, main.ts, index.html)
- T007, T008 can run in parallel (ProgressManager, BootScene)
- T035, T036, T037 can all run in parallel (level JSON files by tier)
- T048, T049, T051, T052 can all run in parallel (audio, animations, scene polish)
- US2 and US3 can potentially run in parallel after US1 (they modify GameScene differently)

---

## Parallel Example: User Story 4

```bash
# All level tier groups can be created in parallel:
Task: "Create level-06 through level-10 in src/data/levels/"
Task: "Create level-11 through level-15 in src/data/levels/"
Task: "Create level-16 through level-20 in src/data/levels/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Play Level 1-3 with arrow keys, verify maze navigation and level completion
5. Playable demo ready

### Incremental Delivery

1. Setup + Foundational → Project runnable
2. User Story 1 → Core maze gameplay (MVP)
3. User Story 2 → Math puzzles added
4. User Story 3 → Items and scoring
5. User Story 4 → Full 20-level experience
6. User Story 5 → Mobile and PWA support
7. Polish → Audio, animations, final quality

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Level JSON files use seeds for reproducible maze generation — verify solvability after creation
