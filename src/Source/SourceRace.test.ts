import { SourceWithPool } from "../Source/SourceWithPool";
import { SourceRace } from "./SourceRace";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

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

  sAny.value((v) => {
    expect(v).toBe(1);
  });

  setTimeout(() => {
    s1.give(3);
    s2.give(4);
  }, 300);

  await vi.advanceTimersByTime(301);

  sAny.value((v) => {
    // ignores second value
    expect(v).toBe(3);
  });
});
