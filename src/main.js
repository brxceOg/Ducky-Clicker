import {
  createInitialState,
  earnQuackPoints,
  formatCount,
  getDucklingHelperCost,
  getProductionPerSecond,
  canAffordDucklingHelper,
  buyDucklingHelper,
  accrueProduction,
} from "./game-state.js";

const state = createInitialState();
const duckButton = document.querySelector("#duck-button");
const countDisplay = document.querySelector("#quack-count");
const tapPowerDisplay = document.querySelector("#tap-power");
const productionRateDisplay = document.querySelector("#production-rate");
const effectsLayer = document.querySelector("#click-effects");
const scene = document.querySelector(".pond-scene");
const helperOwnedDisplay = document.querySelector("#helper-owned");
const helperPriceDisplay = document.querySelector("#helper-price");
const buyHelperButton = document.querySelector("#buy-helper");
const purchaseFeedback = document.querySelector("#purchase-feedback");
const producerPanel = document.querySelector(".producer-panel");

if (
  !duckButton || !countDisplay || !tapPowerDisplay || !productionRateDisplay
  || !effectsLayer || !scene || !helperOwnedDisplay || !helperPriceDisplay
  || !buyHelperButton || !purchaseFeedback || !producerPanel
) {
  throw new Error("Ducky Clicker could not start because a required game element is missing.");
}

let lastPurchaseMessage = "";
let lastProductionTick = performance.now();

function render() {
  const price = getDucklingHelperCost(state.ducklingHelpers);
  const affordable = canAffordDucklingHelper(state);
  const shortfall = Math.max(0, price - state.quackPoints);
  const production = getProductionPerSecond(state);

  countDisplay.textContent = formatCount(state.quackPoints);
  tapPowerDisplay.textContent = `+${formatCount(state.tapPower)}`;
  productionRateDisplay.textContent = `+${formatCount(production)}/s`;
  helperOwnedDisplay.textContent = `OWNED: ${formatCount(state.ducklingHelpers)}`;
  helperPriceDisplay.textContent = formatCount(price);
  buyHelperButton.disabled = !affordable;
  buyHelperButton.textContent = affordable ? `Hire · ${formatCount(price)}` : `Need ${formatCount(shortfall)} more`;
  buyHelperButton.setAttribute(
    "aria-label",
    affordable
      ? `Hire one Duckling Helper for ${formatCount(price)} Quack Points`
      : `Cannot afford Duckling Helper. Need ${formatCount(shortfall)} more Quack Points.`,
  );
  duckButton.setAttribute(
    "aria-label",
    `Tap the rubber duck to earn ${state.tapPower} Quack Point${state.tapPower === 1 ? "" : "s"}`,
  );

  if (!lastPurchaseMessage) {
    purchaseFeedback.textContent = affordable
      ? "You can afford a helper. Give them a job!"
      : `Earn ${formatCount(shortfall)} more Quack Point${shortfall === 1 ? "" : "s"} to hire your first helper.`;
    purchaseFeedback.classList.remove("is-success");
  }
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
  Object.assign(state, earnQuackPoints(state));
  lastPurchaseMessage = "";
  render();

  duckButton.classList.remove("is-tapping");
  // Restart the short tap animation without delaying the next interaction.
  void duckButton.offsetWidth;
  duckButton.classList.add("is-tapping");
  spawnReward();
  if (state.totalTaps % 3 === 0) spawnSparkle();
});

buyHelperButton.addEventListener("click", () => {
  if (!canAffordDucklingHelper(state)) return;
  const paidPrice = getDucklingHelperCost(state.ducklingHelpers);
  const nextState = buyDucklingHelper(state);
  if (nextState === state) return;

  Object.assign(state, nextState);
  lastPurchaseMessage = `Hired! Your ${formatCount(state.ducklingHelpers)} Duckling Helper${state.ducklingHelpers === 1 ? "" : "s"} now generate ${formatCount(getProductionPerSecond(state))} Quack Point${getProductionPerSecond(state) === 1 ? "" : "s"} per second. Spent ${formatCount(paidPrice)} points.`;
  purchaseFeedback.textContent = lastPurchaseMessage;
  purchaseFeedback.classList.add("is-success");
  producerPanel.classList.remove("has-purchase");
  void producerPanel.offsetWidth;
  producerPanel.classList.add("has-purchase");
  render();
  // render updates the purchase affordance but preserves the confirmation.
  purchaseFeedback.textContent = lastPurchaseMessage;
  purchaseFeedback.classList.add("is-success");
});

duckButton.addEventListener("animationend", (event) => {
  if (event.animationName === "duck-tap") duckButton.classList.remove("is-tapping");
});

producerPanel.addEventListener("animationend", (event) => {
  if (event.animationName === "purchase-panel-pop") producerPanel.classList.remove("has-purchase");
});

function productionLoop(now) {
  const elapsedSeconds = Math.max(0, (now - lastProductionTick) / 1000);
  lastProductionTick = now;
  if (state.ducklingHelpers > 0 && elapsedSeconds > 0) {
    Object.assign(state, accrueProduction(state, elapsedSeconds));
    render();
  }
  window.requestAnimationFrame(productionLoop);
}

render();
window.requestAnimationFrame(productionLoop);
