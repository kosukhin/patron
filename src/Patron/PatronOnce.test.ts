import { wait } from "./../../test-utils/wait";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Source } from "../Source/Source";
import { PatronOnce } from "./PatronOnce";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("PatronOnce.test", async () => {
  const source = new Source(12);
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
