import { GuestAwareRace } from './GuestAwareRace';
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { SourceEmpty } from "../Source/SourceEmpty";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('GuestAwareRace.test', async () => {
  const sBuild = (result: number, delay: number) => {
    const s = new SourceEmpty();

    setTimeout(() => {
      s.give(result);
    }, delay)

    return s;
  }

  const s2 = sBuild(2, 100);
  const s1 = sBuild(1, 200);

  const sAny = new GuestAwareRace([s1, s2]);

  await vi.advanceTimersByTime(201);

  sAny.value(v => {
    expect(v).toBe(1);
  })

  setTimeout(() => {
    s1.give(3);
    s2.give(4);
  }, 300);

  await vi.advanceTimersByTime(301);

  sAny.value(v => {
    // ignores second value
    expect(v).toBe(3);
  })
});
