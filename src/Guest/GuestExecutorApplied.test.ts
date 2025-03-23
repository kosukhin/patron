import { Patron } from "../Patron/Patron";
import { expect, test, vi } from "vitest";
import { SourceWithPool } from "../Source/SourceWithPool";
import { GuestExecutorApplied } from "../Guest/GuestExecutorApplied";
import { debounce } from "../../test-utils/debounce";

test("GuestExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  let counter = 0;
  const guest = (v: number) => {
    counter += v;
  };

  const source = new SourceWithPool();
  source.value(
    new Patron(new GuestExecutorApplied(guest, debounce.bind(null, 100))),
  );

  source.give(1);
  source.give(1);
  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);
  vi.useRealTimers();
});
