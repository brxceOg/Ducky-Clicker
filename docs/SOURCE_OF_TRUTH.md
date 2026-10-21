# Ducky Clicker — Source of Truth

**Project:** Ducky Clicker  
**Status:** Initial playable clicker slice in progress  
**Last updated:** 2026-10-21

This is the authoritative reference for the game's purpose, scope, boundaries, architecture expectations, and implementation priorities. Update it when the owner approves a consequential change.

## 1. Project identity

Ducky Clicker is a standalone rubber-duck-themed idle/clicker game made as a personal gift for Abby. It takes inspiration from the satisfying incremental progression of games such as Cookie Clicker, but must have its own characters, setting, writing, visual identity, mechanics, and content.

**Premise:** Abby starts with one ordinary rubber duck and gradually builds a duck-based enterprise so successful and inexplicable that it disrupts dimensions, timelines, and reality itself.

**Tone:** Cute but increasingly unhinged. Start friendly and funny, then reveal increasingly strange mysteries beneath the cheerful surface.

**Visual style:** Pixel art. See [ART_DIRECTION.md](ART_DIRECTION.md).

**Working title:** Ducky Clicker. “Quackonomics” is a possible in-world title only; all alternate titles remain provisional unless approved.

## 2. Hard boundaries

- This is a separate project from Abby's Pond and Quack & Co. Industrial Complex.
- Do not modify, import, or depend on those projects' code, game state, save data, progression, or assets unless the owner explicitly approves a specific reuse.
- Maintain an independent codebase, asset directory, economy, narrative, and save namespace.
- Do not assume features from those other projects exist here.
- The game is a **browser game**, with **iPhone Safari/mobile playability as a first-class requirement** and desktop browser support as well.
- The game should be comfortable to play on mobile and desktop.
- Never claim a feature is implemented, tested, committed, or deployed unless that has been verified.

## 3. Core design pillars

1. **Satisfying progression:** clicking is rewarding; upgrades and automation make numbers grow; new systems add fresh goals, not only larger numbers.
2. **A coherent absurd universe:** item descriptions, events, characters, discoveries, and achievements build a connected world.
3. **Long-term depth:** collections, research, events, achievements, secrets, and prestige provide varied reasons to return.
4. **Readable responsive presentation:** currency, prices, production rates, controls, and unlock requirements stay clear on small screens.
5. **Expandable implementation:** add content through data and reusable systems instead of bespoke logic for every item.

## 4. Core gameplay loop

1. Click the main rubber duck to earn the primary currency.
2. Spend currency on upgrades and producers.
3. Producers generate currency automatically.
4. Reach milestones to unlock buildings, research, duck variants, story entries, and systems.
5. Complete achievements and discover secrets.
6. Eventually unlock prestige, exchanging some run-specific progress for permanent rewards and access to later layers.

The first playable milestone should polish this core loop before attempting the entire content catalog.

## 5. Initial currencies and progression

These names and roles are the starting proposal and may be tuned during balancing:

- **Quack Points:** primary currency from clicks and producers; used for ordinary purchases.
- **Research Data:** secondary resource for technologies, mutations, and advanced unlocks.
- **Ancient Feathers:** rare prestige resource earned from major milestones or prestige resets; used for permanent progression.

Avoid adding currencies unless each has a clear, distinct gameplay purpose.

### Suggested progression stages

1. **The Squeaky Beginning:** clicking, small producers, simple upgrades, first achievements.
2. **Industrial Quackvolution:** duck workers, factories, production synergies, management absurdities.
3. **Project Rubber Genesis:** research, mutations, collection entries, secret laboratories, deeper lore.
4. **The Multiquack:** alternate dimensions, timeline anomalies, prestige, endgame challenges and revelations.

These are milestones within one game, not separate games. Unlocks should be clear and not overwhelm new players.

## 6. Intended long-term systems

Add these incrementally and test each layer:

- Click power, producers, upgrade tiers, multipliers, and production synergies.
- Milestones, achievements, statistics, and unlock notifications.
- Duck collection with common, rare, special, and secret variants.
- Research tree and experiments/mutations.
- Duckipedia or equivalent encyclopedia for species, characters, machinery, discoveries, and lore.
- Character dialogue, random events, corporate announcements, and narrative discoveries.
- Rare click events such as Golden Ducks with time-limited rewards.
- Prestige with permanent bonuses and new progression layers.
- Secrets and multiple late-game outcomes where appropriate.
- Save/load, automatic saves, offline earnings, and recovery/versioning safeguards.
- Sound effects, animation, accessibility options, and quality-of-life controls.

Do not build all systems at once. Keep each implementation layer playable.

## 7. Narrative principles

- Start cute, accessible, and relatively grounded.
- Escalate absurdity gradually; major revelations should feel earned.
- Tell the story through short item descriptions, events, dialogue, research notes, and encyclopedia entries.
- Keep recurring names and facts consistent in a central lore/content catalog.
- Comedy can conceal a genuine mystery, but the story must not obscure the next gameplay goal.
- The player builds an empire; the ducks may have a much stranger origin than anyone suspects.
- “Project Rubber Genesis,” “The Original Duck,” “Gerald,” and “The First Quack” are candidate concepts, not immutable canon. Confirm them when content is authored.

## 8. Technical and architecture principles

The game platform is confirmed: **browser game, playable on iPhone**. Repository inspection on 2026-10-21 found no existing application entry point, package manifest, or framework; the repository initially contained the planning documents and art reference only. The first foundation therefore uses **dependency-free HTML, CSS, and native JavaScript ES modules**, with no bundler or framework.

Current implementation structure:
- `index.html` — accessible page structure and inline SVG main duck.
- `styles.css` — responsive pixel-inspired presentation, touch-friendly interaction, and reduced-motion support.
- `src/main.js` — DOM interaction, rendering, and tap feedback.
- `src/game-state.js` — pure state, tapping, Duckling Helper cost/affordability/purchase, passive production, and number-formatting logic.
- `tests/game-state.test.js` — Node's built-in test runner for click rewards, producer economy, and production accumulation.
- `package.json` — `npm test` and a local static server command (`npm start`, requiring Python 3).
- `assets/reference/ducky-clicker-asset-sheets.png` — visual concept reference, not a finished sprite atlas.

Before the first playable milestone is declared complete:
1. Run the automated tests and check the browser console and network behavior.
2. Verify repeated duck taps, helper purchases, affordability transitions, and passive income in a real browser at mobile and desktop widths.
3. Test on iPhone Safari if a real device is available; otherwise explicitly state that device verification remains outstanding.
4. Configure and verify a deployment before sharing any public playable URL.

Once selected, prefer:
- One authoritative game-state model.
- Centralized currency, cost, production, and upgrade calculations.
- Data-driven definitions for producers, upgrades, achievements, species, events, and lore.
- Modular systems with clear interfaces.
- Explicit unlock conditions and predictable update order.
- A versioned save format with defensive loading and a migration strategy.
- Timestamp-based offline earnings with a configurable cap.
- Responsive layout and touch-friendly controls.
- Tests for economy math, affordability, production, unlocks, save/load, and offline progress.

Avoid duplicated economy calculations, scattered magic numbers, tightly coupled UI/game logic, and unnecessary dependencies.

## 9. Save and offline progress

- Progress must survive reloads and return visits.
- Save automatically at sensible intervals and after important state changes.
- Store a save version and handle missing or older fields safely.
- Never overwrite a valid save with malformed data without a deliberate recovery path.
- Calculate offline production from the saved timestamp on return.
- Apply a configurable offline earnings cap and communicate the result clearly.
- Reject negative elapsed time and invalid numeric values.
- Treat any future cloud-save system as a separately designed feature, not an assumed capability.

## 10. Browser, iPhone, accessibility, and UX requirements

- Deliver a browser game; do not switch to a native-only app without explicit approval.
- Treat iPhone Safari and narrow touchscreens as primary supported environments, not a later polish task.
- Use responsive layouts, touch-friendly controls, and avoid hover-only interactions.
- Check safe-area insets where needed and ensure important controls are not obscured by browser chrome or device edges.
- Verify scrolling, tap targets, number readability, and layout behavior at mobile widths.
- Design for narrow phone screens first, while remaining good on desktop.
- Make the main duck easy to tap and keep important navigation reachable.
- Keep currency, production rate, item price, and affordability legible.
- Provide feedback for clicks, purchases, unlocks, and special events without overwhelming the player.
- Respect reduced-motion preferences where feasible.
- Do not make essential gameplay information depend on color alone.
- Avoid overlays that obscure the duck or block unrelated controls.

## 11. Implementation milestones

### Milestone 1 — Project foundation
Confirm the stack and entry point; establish structure and pixel-art presentation; create a responsive shell and clickable duck; keep this repository independent. **Foundation implemented; browser/device verification still required.**

### Milestone 2 — Playable clicker
Add primary currency, click rewards, producers, upgrades, purchase feedback, production-per-second display, and a small balanced starter catalog. **Initial slice implemented:** one Duckling Helper costs 10 Quack Points, produces 1 Quack Point/second, and each subsequent helper costs 15% more (rounded up). Purchase, affordability, owned count, and fractional passive accrual are connected to game state. More upgrades and balancing remain.

### Milestone 3 — Persistence
Add automatic save/load, save versioning, offline earnings, and reload testing.

### Milestone 4 — First progression layer
Add unlocks, milestones, achievements, and initial lore entries.

### Milestone 5 — Universe expansion
Add research, collection, events, and encyclopedia using reusable systems.

### Milestone 6 — Prestige and polish
Add prestige and late-game progression after the earlier loop is stable; then balance, test, and polish.

## 12. Definition of done and delivery rules

A feature is not done merely because code was written. Verify that it matches this document and the art direction; existing controls still work; layouts work on narrow and wide screens; economy and state changes are consistent; save/load is correct where relevant; edge cases are considered; and meaningful behavior changes are documented.

**No-placeholder rule:**
- Do not leave TODOs, stub handlers, fake buttons, empty screens, mock-only behavior, unfinished functions, or placeholder content in code presented as complete.
- When a feature is included in a milestone, implement its full intended behavior and connect it to the real game state/UI.
- If something genuinely cannot be completed, disclose it clearly as unfinished and do not represent the milestone as complete. Ask for a scope decision or explain the blocker instead of quietly leaving a placeholder.
- Before calling a milestone finished, search for TODO/FIXME/stub/placeholder markers and inspect any matches. Explain any intentional remaining markers.

**Commit and playable-link rule:**
- After every implementation batch, commit the finished code to this repository and report what changed and the commit.
- After all commits for a playable milestone are complete, provide a **direct playable URL** for testing, not just a repository or source-code link.
- The playable URL must point to a deployed browser build that can actually be opened and tested. Do not invent a URL or call a preview playable unless deployment has been verified.
- If deployment is not configured or cannot be completed, state that plainly and provide the exact next step needed to publish it; do not claim a playable link exists.
- Before sharing the link, verify the deployed build loads and smoke-test the main click loop and essential controls. Test on iPhone Safari when device/browser testing is available; otherwise disclose that it still needs real-device verification.
- Include a short test checklist with each playable link and note any known limitations.

## 13. Decision log

- **2026-10-21:** Standalone pixel-art rubber-duck clicker for Abby established.
- **2026-10-21:** Scope is the full duck universe, delivered incrementally.
- **2026-10-21:** Tone is cute but increasingly unhinged.
- **2026-10-21:** Must remain separate from Abby's Pond and Quack & Co. Industrial Complex.
- **2026-10-21:** Platform confirmed as a browser game playable on iPhone; mobile Safari support is a first-class requirement.
- **2026-10-21:** Implementation rule: finish included code without silent placeholders; after milestone commits, provide and verify a direct playable testing link.
- **2026-10-21:** First producer is Duckling Helper: base price 10 Quack Points, +1 Quack Point/second, and 1.15x price growth per owned helper (rounded up). This is the starter economy and may be rebalanced after playtesting.
- **2026-10-21:** Repository inspected; no prior app/framework existed. Began the foundation with native HTML/CSS/JavaScript ES modules and Node's built-in test runner; this is the initial stack, not a permanent lock-in.
- **Pending:** Finalize public-facing in-game title and canonical lore names.

## 14. Maintaining this document

Update this file when a core design, scope, architecture, or technical constraint changes. Update [ART_DIRECTION.md](ART_DIRECTION.md) when visual standards or asset requirements change. Keep status truthful: planned, in progress, implemented, and verified are different states. Record consequential decisions instead of silently contradicting earlier ones.
