export const INITIAL_TAP_POWER = 1;

export function createInitialState() {
  return {
    quackPoints: 0,
    totalTaps: 0,
    tapPower: INITIAL_TAP_POWER,
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

export function formatCount(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError("Displayed counts must be finite and non-negative.");
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}
