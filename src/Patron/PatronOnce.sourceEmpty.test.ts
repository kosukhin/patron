import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { PatronOnce } from "./PatronOnce";
import { SourceWithPool } from "../Source/SourceWithPool";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, ms);
  });

test("PatronOnce.sourceEmpty.test", async () => {
  const source = new SourceWithPool();
  let calls = 0;
  const patron = new PatronOnce(() => {
    calls += 1;
  });
  source.value(patron);

  await wait(10);
  source.give(22);
  await wait(10);
  source.give(32);
  await wait(10);
  source.give(42);
  await wait(10);

  expect(calls).toBe(1);
});
