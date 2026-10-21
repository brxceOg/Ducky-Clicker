# Ducky Clicker

A standalone rubber-duck-themed incremental browser game. The visual tone starts cozy and cute, with room to get increasingly unhinged as the duck empire grows.

## Current foundation

- Responsive, mobile-first page designed for touch and desktop pointer input.
- A cheerful inline SVG rubber duck with tap animation.
- Quack Points counter, per-tap rewards, and floating reward feedback.
- First producer: Duckling Helper, with a scaling Quack Point price and +1 Quack Point per second.
- Working affordability checks, hire action, owned count, production-per-second display, and purchase confirmation animation.
- Fractional production accumulation so short animation frames do not discard earned progress.
- Game economy kept separately from DOM code, with automated tests for purchase and production rules.
- Reduced-motion support and keyboard-visible focus styling.

The current playable slice includes manual tapping and the first automatic producer. Saving, offline progress, upgrades beyond the starter producer, and broader progression systems have not been implemented yet.

## Run locally

Requirements: Node.js (for tests) and Python 3 (for the no-dependency static server).

```sh
npm test
npm start
```

Then open http://localhost:4173 in a browser. Stop the server with Ctrl+C.

No framework, bundler, or third-party runtime dependency is required. The stylesheet uses a system-font fallback if its optional web font is unavailable.

## Project map

- `index.html` — page structure and duck SVG.
- `styles.css` — responsive visual design and animation.
- `src/main.js` — browser interaction and UI feedback.
- `src/game-state.js` — pure state/reward helpers.
- `tests/game-state.test.js` — Node test suite.
- `docs/SOURCE_OF_TRUTH.md` — scope, architecture, milestones, and delivery requirements.
- `docs/ART_DIRECTION.md` — visual standards.
- `assets/reference/ducky-clicker-asset-sheets.png` — concept-sheet reference, not a production sprite atlas.

## Status

The automated state tests cover tapping, producer pricing, affordability, purchases, and passive production. Real-browser smoke testing, real-device iPhone Safari verification, and deployment verification must be completed before describing this as a verified playable release.
