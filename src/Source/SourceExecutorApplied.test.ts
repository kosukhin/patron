import { SourceExecutorApplied } from "../Source/SourceExecutorApplied";
import { SourceWithPool } from "../Source/SourceWithPool";
import { debounce } from "../../test-utils/debounce";
import { expect, test, vi } from "vitest";
import { Patron } from "../Patron/Patron";

test("SourceExecutorApplied.test", () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const source = new SourceWithPool<number>();
  const sourceDebounced = new SourceExecutorApplied(
    source,
    debounce.bind(null, 100),
  );

  let counter = 0;
  sourceDebounced.value(
    new Patron((v) => {
      counter += v;
    }),
  );

  source.give(1);
  source.give(1);
  source.give(1);

  vi.runOnlyPendingTimers();

  expect(counter).toBe(1);
});
