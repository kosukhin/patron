import { SourceWithPool } from "../Source/SourceWithPool";
import { SourceRace } from "./SourceRace";
import { afterEach, beforeEach, expect, test, vi, vitest } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("SourceRace.test", async () => {
  const sBuild = (result: number, delay: number) => {
    const s = new SourceWithPool();

    setTimeout(() => {
      s.give(result);
    }, delay);

    return s;
  };

  const s2 = sBuild(2, 100);
  const s1 = sBuild(1, 200);

  const sAny = new SourceRace([s1, s2]);

  await vi.advanceTimersByTime(201);

  const g1 = vitest.fn();
  sAny.value(g1);
  expect(g1).toBeCalledWith(1);

  setTimeout(() => {
    s1.give(3);
    s2.give(4);
  }, 300);

  await vi.advanceTimersByTime(301);

  const g2 = vitest.fn();
  sAny.value(g2);
  // ignores second value
  expect(g2).toBeCalledWith(3);
});
