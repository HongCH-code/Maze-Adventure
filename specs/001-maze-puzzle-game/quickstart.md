# Quickstart: Maze Puzzle Game

## Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A modern browser (Chrome, Firefox, Safari, or Edge)

## Setup

```bash
# Clone and enter the project
cd Maze-Adventure

# Install dependencies
npm install

# Start development server
npm run dev
```

The game opens at `http://localhost:5173` (Vite default port).

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest unit tests |

## Project Layout

```text
src/
├── main.ts              # Game bootstrap and Phaser config
├── scenes/              # Phaser scenes (Boot, Title, LevelSelect, Game, Puzzle, LevelComplete)
├── systems/             # Game logic (MazeGenerator, PuzzleManager, ItemRegistry, etc.)
├── data/levels/         # Level JSON files (level-01.json ... level-20.json)
├── data/puzzles/        # Puzzle pool configurations
├── assets/              # Sprites, tilemaps, audio
└── types/               # TypeScript interfaces
```

## Key Workflows

### Adding a new level

1. Create `src/data/levels/level-NN.json` following the level schema (see `data-model.md`)
2. The game auto-discovers level files — no code changes needed

### Adding a new puzzle type

1. Create a generator function implementing the `PuzzleGenerator` interface
2. Register it in `PuzzleManager` with a unique type key
3. Reference the type key in level JSON `puzzleGates[].puzzleType`

### Adding a new item type

1. Define the item in `ItemRegistry` with a unique type key, sprite reference, and collection behavior
2. Place it in level JSON `items[]` with the new type key

## Testing on mobile

1. Run `npm run dev -- --host` to expose the dev server on your local network
2. Open `http://<your-ip>:5173` on your mobile device
3. For PWA testing, run `npm run build && npm run preview -- --host` (service worker only works on production builds)

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents to any static hosting (Netlify, Vercel, GitHub Pages, etc.). The build includes the PWA manifest and service worker for offline support.
