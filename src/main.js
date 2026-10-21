import { createInitialState, earnQuackPoints, formatCount } from "./game-state.js";

const state = createInitialState();
const duckButton = document.querySelector("#duck-button");
const countDisplay = document.querySelector("#quack-count");
const effectsLayer = document.querySelector("#click-effects");
const scene = document.querySelector(".pond-scene");

if (!duckButton || !countDisplay || !effectsLayer || !scene) {
  throw new Error("Ducky Clicker could not start because a required game element is missing.");
}

function render() {
  countDisplay.textContent = formatCount(state.quackPoints);
  duckButton.setAttribute(
    "aria-label",
    `Tap the rubber duck to earn ${state.tapPower} Quack Point${state.tapPower === 1 ? "" : "s"}`
  );
}

function spawnReward() {
  const bounds = scene.getBoundingClientRect();
  const reward = document.createElement("span");
  reward.className = "float-reward";
  reward.textContent = `+${formatCount(state.tapPower)}`;
  reward.style.left = `${Math.min(bounds.width - 28, Math.max(28, bounds.width / 2 + (Math.random() - 0.5) * 90))}px`;
  reward.style.top = `${Math.max(90, bounds.height * 0.35 + (Math.random() - 0.5) * 20)}px`;
  effectsLayer.append(reward);
  reward.addEventListener("animationend", () => reward.remove(), { once: true });
}

function spawnSparkle() {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle-pop";
  sparkle.textContent = "✦";
  sparkle.style.left = `${38 + Math.random() * 24}%`;
  sparkle.style.top = `${30 + Math.random() * 18}%`;
  effectsLayer.append(sparkle);
  sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
}

duckButton.addEventListener("click", () => {
  const nextState = earnQuackPoints(state);
  Object.assign(state, nextState);
  render();

  duckButton.classList.remove("is-tapping");
  // Restart the short tap animation without delaying the next interaction.
  void duckButton.offsetWidth;
  duckButton.classList.add("is-tapping");
  spawnReward();
  if (state.totalTaps % 3 === 0) spawnSparkle();
});

duckButton.addEventListener("animationend", (event) => {
  if (event.animationName === "duck-tap") duckButton.classList.remove("is-tapping");
});

render();
