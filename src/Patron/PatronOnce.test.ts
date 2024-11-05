import { expect, test } from "vitest";
import { PatronOnce } from "./PatronOnce";
import { Source } from "../Source/Source";

test("patron once", () => {
  const source = new Source(42);
  let calls = 0;
  const patron = new PatronOnce(() => {
    calls += 1;
  });
  source.value(patron);
  source.give(22);
  source.give(22);
  source.give(22);

  expect(calls).toBe(1);
});
