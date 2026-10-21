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
const tapHint = document.querySelector(".tap-hint");
const currencyBeak = document.querySelector(".beak-icon");
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
const walkingDucklingsLayer = document.querySelector("#walking-ducklings");

if (
  !duckButton || !countDisplay || !tapPowerDisplay || !productionRateDisplay
  || !effectsLayer || !scene || !helperOwnedDisplay || !helperPriceDisplay
  || !buyHelperButton || !purchaseFeedback || !producerPanel || !walkingDucklingsLayer
) {
  throw new Error("Ducky Clicker could not start because a required game element is missing.");
}

let lastPurchaseMessage = "";
let lastProductionTick = performance.now();
const walkingDucklings = [];

function createDucklingSprite() {
  // Clone the purchase-card artwork so the walking character is exactly the same SVG.
  const icon = document.querySelector(".producer-art svg");
  if (!icon) throw new Error("Duckling Helper artwork is missing.");
  const sprite = icon.cloneNode(true);
  sprite.setAttribute("aria-hidden", "true");
  sprite.removeAttribute("role");
  sprite.removeAttribute("aria-labelledby");
  sprite.querySelectorAll("title").forEach((title) => title.remove());
  return sprite;
}

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

function spawnWalkingDuckling() {
  const bounds = scene.getBoundingClientRect();
  const sprite = document.createElement("div");
  sprite.className = "walking-duckling";
  sprite.append(createDucklingSprite());

  // Spawn in the visible grass beside/below the main duck, not underneath its large tap target.
  // Alternate sides so a newly hired helper is immediately easy to spot on phone-sized scenes.
  const spawnLeft = Math.random() < 0.5;
  const sideX = spawnLeft
    ? bounds.width * (0.13 + Math.random() * 0.09)
    : bounds.width * (0.78 + Math.random() * 0.09);
  const duckling = {
    element: sprite,
    x: Math.min(bounds.width - 25, Math.max(25, sideX)),
    y: bounds.height * (0.62 + Math.random() * 0.14),
    vx: (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 14),
    vy: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 8),
    turnIn: 1.2 + Math.random() * 2.2,
  };

  walkingDucklingsLayer.append(sprite);
  walkingDucklings.push(duckling);
  sprite.classList.add("is-spawning");
  sprite.addEventListener("animationend", (event) => {
    if (event.animationName === "duckling-spawn") sprite.classList.remove("is-spawning");
  });
  positionWalkingDuckling(duckling);
}

function positionWalkingDuckling(duckling) {
  duckling.element.style.left = `${duckling.x}px`;
  duckling.element.style.top = `${duckling.y}px`;
  duckling.element.style.transform =
    `translate(-50%, -50%) scaleX(${duckling.vx < 0 ? "-1" : "1"})`;
}

function moveWalkingDucklings(elapsedSeconds) {
  if (walkingDucklings.length === 0) return;

  const bounds = scene.getBoundingClientRect();
  const minX = 22;
  const maxX = Math.max(minX, bounds.width - 22);
  const minY = bounds.height * 0.54;
  const maxY = Math.max(minY, bounds.height - 43);
  const dt = Math.min(elapsedSeconds, 0.05);

  for (const duckling of walkingDucklings) {
    duckling.turnIn -= dt;
    if (duckling.turnIn <= 0) {
      duckling.vx = (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 14);
      duckling.vy = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 8);
      duckling.turnIn = 1.2 + Math.random() * 2.2;
    }

    duckling.x += duckling.vx * dt;
    duckling.y += duckling.vy * dt;

    if (duckling.x < minX || duckling.x > maxX) {
      duckling.x = Math.min(maxX, Math.max(minX, duckling.x));
      duckling.vx *= -1;
    }
    if (duckling.y < minY || duckling.y > maxY) {
      duckling.y = Math.min(maxY, Math.max(minY, duckling.y));
      duckling.vy *= -1;
    }

    positionWalkingDuckling(duckling);
  }
}

duckButton.addEventListener("click", () => {
  if (currencyBeak) {
    currencyBeak.classList.remove("is-quacking");
    void currencyBeak.offsetWidth;
    currencyBeak.classList.add("is-quacking");
    window.setTimeout(() => currencyBeak.classList.remove("is-quacking"), 560);
  }
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
  spawnWalkingDuckling();
  lastPurchaseMessage = `Hired! Your ${formatCount(state.ducklingHelpers)} Duckling Helper${state.ducklingHelpers === 1 ? "" : "s"} now generate ${formatCount(getProductionPerSecond(state))} Quack Point${getProductionPerSecond(state) === 1 ? "" : "s"} per second. A baby duckling waddles into the pond! Spent ${formatCount(paidPrice)} points.`;
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
  moveWalkingDucklings(elapsedSeconds);
  if (state.ducklingHelpers > 0 && elapsedSeconds > 0) {
    Object.assign(state, accrueProduction(state, elapsedSeconds));
    render();
  }
  window.requestAnimationFrame(productionLoop);
}

render();
// Hide the onboarding hint after the player has had a moment to see it.
if (tapHint) {
  window.setTimeout(() => tapHint.classList.add("is-hidden"), 2600);
}
window.requestAnimationFrame(productionLoop);
