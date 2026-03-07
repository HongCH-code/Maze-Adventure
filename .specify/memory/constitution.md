<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Added principles:
  - I. Game Experience First
  - II. Progressive Difficulty
  - III. Extensible Architecture
  - IV. Cross-Platform Compatibility
  - V. Simplicity & Accessibility
- Added sections:
  - Technical Constraints
  - Development Workflow
  - Governance
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed (generic)
  - .specify/templates/spec-template.md ✅ no changes needed (generic)
  - .specify/templates/tasks-template.md ✅ no changes needed (generic)
- Follow-up TODOs: none
-->

# Maze Adventure Constitution

## Core Principles

### I. Game Experience First

Smooth, responsive gameplay MUST take priority over code elegance or feature breadth.

- Rendering MUST maintain 60fps on target devices (modern browsers, mobile Safari/Chrome).
- Input response (touch and keyboard) MUST feel immediate; input lag above 100ms is a defect.
- Animations and transitions MUST be fluid; jarring jumps between states are not acceptable.
- When a performance concern conflicts with an architectural preference, performance wins.

### II. Progressive Difficulty

The game contains 20 levels. Maze complexity and puzzle difficulty MUST scale gradually.

- Level 1 MUST be trivially solvable, serving as a tutorial.
- Complexity increases MUST be incremental; no single level jump should feel unfair.
- Puzzles MUST be limited to first-grade math (addition, subtraction, counting, basic shapes and comparisons within 20).
- Each level MUST be completable by the target audience (children age 6-7) without external help.

### III. Extensible Architecture

The codebase MUST support adding new levels, items, and puzzle types without modifying existing core logic.

- Level definitions MUST be data-driven (configuration/JSON), not hardcoded in game logic.
- The item system MUST use a registry pattern so new items can be added by registering a definition.
- Puzzle types MUST be pluggable; adding a new puzzle type MUST NOT require changes to the maze or level runner.
- Scene transitions, UI overlays, and HUD elements MUST be decoupled from maze logic.

### IV. Cross-Platform Compatibility

The game MUST run on both desktop browsers and mobile devices from a single codebase.

- Touch controls and keyboard controls MUST both be fully supported.
- Layout MUST adapt to different screen sizes and aspect ratios (responsive scaling).
- The game MUST be installable as a PWA for offline mobile play.
- No platform-specific code paths; Phaser's built-in abstraction layer handles device differences.

### V. Simplicity & Accessibility

The game targets young children. Every design decision MUST favor clarity and simplicity.

- UI text MUST be minimal and use large, readable fonts.
- Visual cues (colors, icons, animations) MUST clearly communicate game state and objectives.
- No complex menu hierarchies; navigation MUST be intuitive with minimal taps/clicks.
- Audio and visual feedback MUST reinforce correct actions and gently indicate mistakes.

## Technical Constraints

- **Engine**: Phaser 3 (latest stable)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Target Platforms**: Modern desktop browsers (Chrome, Firefox, Safari, Edge), mobile browsers (iOS Safari, Android Chrome)
- **Deployment**: Static site hosting with PWA manifest and service worker
- **Asset Format**: Sprites and tilemaps; prefer lightweight formats (PNG, JSON) to minimize load time on mobile
- **State Management**: Phaser's built-in scene and data manager; no external state library unless complexity demands it

## Development Workflow

- Features MUST be implemented one user story at a time, validated before moving to the next.
- Each level MUST be playtested on both desktop and mobile before being considered complete.
- Commits MUST leave the game in a runnable state; broken builds are not acceptable.
- Asset changes and code changes SHOULD be committed separately for clear history.

## Governance

- This constitution defines the non-negotiable boundaries of the project.
- Amendments require documenting the change rationale, updating this file, and incrementing the version.
- Any principle violation MUST be justified in a complexity tracking table within the implementation plan.
- Runtime development guidance is maintained in `CLAUDE.md` at the project root.

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
