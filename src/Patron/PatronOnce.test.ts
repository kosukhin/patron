import { expect, test } from "vitest";
import { PatronOnce } from "./PatronOnce";
import { Source } from "../Source/Source";

test("patron once", () => {
  const source = new Source(42);
  let calls = 0;
  const patron = new PatronOnce(() => {
    calls += 1;
  });
  source.receiving(patron);
  source.receive(22);

  expect(calls).toBe(1);
});
