import test from "node:test";
import assert from "node:assert/strict";
import { createInitialState, earnQuackPoints, formatCount } from "../src/game-state.js";

test("new game starts with zero points and one point per tap", () => {
  assert.deepEqual(createInitialState(), {
    quackPoints: 0,
    totalTaps: 0,
    tapPower: 1,
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
  const state = { quackPoints: 7, totalTaps: 2, tapPower: 3 };
  const next = earnQuackPoints(state);

  assert.equal(next.quackPoints, 10);
  assert.equal(next.totalTaps, 3);
});

test("rejects invalid rewards and invalid balances", () => {
  assert.throws(() => earnQuackPoints(createInitialState(), 0), RangeError);
  assert.throws(() => earnQuackPoints(createInitialState(), -1), RangeError);
  assert.throws(() => earnQuackPoints(createInitialState(), 1.5), RangeError);
  assert.throws(() => earnQuackPoints({ quackPoints: -1, totalTaps: 0, tapPower: 1 }), TypeError);
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
