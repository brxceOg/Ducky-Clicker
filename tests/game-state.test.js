import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  earnQuackPoints,
  formatCount,
  getDucklingHelperCost,
  getProductionPerSecond,
  canAffordDucklingHelper,
  buyDucklingHelper,
  accrueProduction,
} from "../src/game-state.js";

test("new game starts with zero points and one point per tap", () => {
  assert.deepEqual(createInitialState(), {
    quackPoints: 0,
    totalTaps: 0,
    tapPower: 1,
    ducklingHelpers: 0,
    productionRemainder: 0,
    totalProduced: 0,
  });
});

test("earning points increments the balance and tap count without mutating the input", () => {
  const initial = createInitialState();
  const next = earnQuackPoints(initial);
  assert.equal(next.quackPoints, 1);
  assert.equal(next.totalTaps, 1);
  assert.equal(initial.quackPoints, 0);
  assert.equal(initial.totalTaps, 0);
});

test("reward amount can follow the current tap power", () => {
  const next = earnQuackPoints({ ...createInitialState(), quackPoints: 7, totalTaps: 2, tapPower: 3 });
  assert.equal(next.quackPoints, 10);
  assert.equal(next.totalTaps, 3);
});

test("rejects invalid rewards and invalid balances", () => {
  assert.throws(() => earnQuackPoints(createInitialState(), 0), RangeError);
  assert.throws(() => earnQuackPoints(createInitialState(), -1), RangeError);
  assert.throws(() => earnQuackPoints(createInitialState(), 1.5), RangeError);
  assert.throws(() => earnQuackPoints({ quackPoints: -1, totalTaps: 0, tapPower: 1 }, 1), TypeError);
});

test("rejects unsafe point totals", () => {
  assert.throws(
    () => earnQuackPoints({ quackPoints: Number.MAX_SAFE_INTEGER, totalTaps: 0, tapPower: 1 }),
    RangeError,
  );
});

test("formats whole-number counts for display", () => {
  assert.equal(formatCount(0), "0");
  assert.equal(formatCount(1234567), "1,234,567");
  assert.throws(() => formatCount(-1), TypeError);
});

test("first Duckling Helper costs 10 points and subsequent helpers get more expensive", () => {
  assert.equal(getDucklingHelperCost(0), 10);
  assert.equal(getDucklingHelperCost(1), 12);
  assert.equal(getDucklingHelperCost(2), 14);
});

test("purchase checks affordability and deducts the real cost while increasing ownership", () => {
  const broke = { ...createInitialState(), quackPoints: 9 };
  assert.equal(canAffordDucklingHelper(broke), false);
  assert.equal(buyDucklingHelper(broke), broke);

  const funded = { ...createInitialState(), quackPoints: 10 };
  assert.equal(canAffordDucklingHelper(funded), true);
  const bought = buyDucklingHelper(funded);
  assert.equal(bought.quackPoints, 0);
  assert.equal(bought.ducklingHelpers, 1);
  assert.equal(funded.quackPoints, 10);
  assert.equal(getProductionPerSecond(bought), 1);
});

test("production accrues whole points and preserves fractional progress", () => {
  const helperState = { ...createInitialState(), ducklingHelpers: 1 };
  const firstHalf = accrueProduction(helperState, 0.5);
  assert.equal(firstHalf.quackPoints, 0);
  assert.equal(firstHalf.productionRemainder, 0.5);
  const secondHalf = accrueProduction(firstHalf, 0.5);
  assert.equal(secondHalf.quackPoints, 1);
  assert.equal(secondHalf.totalProduced, 1);
  assert.equal(secondHalf.productionRemainder, 0);
});

test("production rejects negative or invalid elapsed time", () => {
  assert.throws(() => accrueProduction(createInitialState(), -1), RangeError);
  assert.throws(() => accrueProduction(createInitialState(), Infinity), RangeError);
});
