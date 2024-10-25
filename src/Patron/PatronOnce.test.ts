import { expect, test } from "vitest";
import { PatronOnce } from "./PatronOnce";
import { SourceOfValue } from "../Source/SourceOfValue";

test("patron once", () => {
  const source = new SourceOfValue(42);
  let calls = 0;
  const patron = new PatronOnce(() => {
    calls += 1;
  });
  source.receiving(patron);
  source.receive(22);

  expect(calls).toBe(1);
});
