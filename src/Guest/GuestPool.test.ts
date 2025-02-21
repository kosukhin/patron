import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { GuestPool } from "./GuestPool";
import { Patron } from "../Patron/Patron";
import { wait } from "test-utils/wait";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("GuestPool.test", async () => {
  const pool = new GuestPool<number>(null);
  let receivedCount = 0;

  // 2 + 2
  pool.add(
    new Patron((value) => {
      receivedCount += value;
    }),
  );
  // 2 + 2
  pool.add(
    new Patron((value) => {
      receivedCount += value;
    }),
  );
  // 2
  pool.add((value) => {
    receivedCount += value;
  });
  pool.give(2);

  setTimeout(() => {
    pool.give(2);
  });

  await wait(50);

  setTimeout(() => {
    pool.give(2);
    expect(receivedCount).toBe(10);
  }, 10);
});
