export const INITIAL_TAP_POWER = 1;
export const DUCKLING_HELPER = Object.freeze({
  id: "duckling-helper",
  name: "Duckling Helper",
  description: "A tiny assistant who takes their job extremely seriously.",
  baseCost: 10,
  productionPerSecond: 1,
  costGrowth: 1.15,
});

export function createInitialState() {
  return {
    quackPoints: 0,
    totalTaps: 0,
    tapPower: INITIAL_TAP_POWER,
    ducklingHelpers: 0,
    productionRemainder: 0,
    totalProduced: 0,
  };
}

export function earnQuackPoints(state, amount = state.tapPower) {
  if (!Number.isSafeInteger(amount) || amount < 1) {
    throw new RangeError("Quack Point rewards must be positive safe integers.");
  }
  if (!Number.isSafeInteger(state.quackPoints) || state.quackPoints < 0) {
    throw new TypeError("Current Quack Points must be a non-negative safe integer.");
  }
  if (!Number.isSafeInteger(state.totalTaps) || state.totalTaps < 0) {
    throw new TypeError("Total taps must be a non-negative safe integer.");
  }
  if (state.quackPoints > Number.MAX_SAFE_INTEGER - amount) {
    throw new RangeError("Quack Point total would exceed the safe integer limit.");
  }
  if (state.totalTaps === Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Tap total would exceed the safe integer limit.");
  }
  return {
    ...state,
    quackPoints: state.quackPoints + amount,
    totalTaps: state.totalTaps + 1,
  };
}

export function getDucklingHelperCost(owned) {
  if (!Number.isSafeInteger(owned) || owned < 0) {
    throw new RangeError("Producer ownership must be a non-negative safe integer.");
  }
  const cost = Math.ceil(DUCKLING_HELPER.baseCost * DUCKLING_HELPER.costGrowth ** owned);
  if (!Number.isSafeInteger(cost)) {
    throw new RangeError("Producer cost exceeds the safe integer limit.");
  }
  return cost;
}

export function getProductionPerSecond(state) {
  if (!Number.isSafeInteger(state.ducklingHelpers) || state.ducklingHelpers < 0) {
    throw new TypeError("Duckling Helper ownership must be a non-negative safe integer.");
  }
  return state.ducklingHelpers * DUCKLING_HELPER.productionPerSecond;
}

export function canAffordDucklingHelper(state) {
  return Number.isSafeInteger(state.quackPoints)
    && state.quackPoints >= getDucklingHelperCost(state.ducklingHelpers);
}

export function buyDucklingHelper(state) {
  if (!canAffordDucklingHelper(state)) return state;
  const cost = getDucklingHelperCost(state.ducklingHelpers);
  if (state.ducklingHelpers === Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Producer ownership would exceed the safe integer limit.");
  }
  return {
    ...state,
    quackPoints: state.quackPoints - cost,
    ducklingHelpers: state.ducklingHelpers + 1,
  };
}

export function accrueProduction(state, elapsedSeconds) {
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
    throw new RangeError("Production elapsed time must be finite and non-negative.");
  }
  if (!Number.isFinite(state.productionRemainder) || state.productionRemainder < 0 || state.productionRemainder >= 1) {
    throw new TypeError("Production remainder must be in the range [0, 1).");
  }
  const exactProduction = getProductionPerSecond(state) * elapsedSeconds + state.productionRemainder;
  const wholePoints = Math.floor(exactProduction);
  if (state.quackPoints > Number.MAX_SAFE_INTEGER - wholePoints
      || state.totalProduced > Number.MAX_SAFE_INTEGER - wholePoints) {
    throw new RangeError("Production total would exceed the safe integer limit.");
  }
  return {
    ...state,
    quackPoints: state.quackPoints + wholePoints,
    productionRemainder: exactProduction - wholePoints,
    totalProduced: state.totalProduced + wholePoints,
  };
}

export function formatCount(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError("Displayed counts must be finite and non-negative.");
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}
