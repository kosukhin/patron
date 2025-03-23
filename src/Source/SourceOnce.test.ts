import { SourceOnce } from "./SourceOnce";
import { expect, test, vitest } from "vitest";

test("SourceOnce.test", () => {
  const source = new SourceOnce(123);
  source.give(321);
  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(123);
});
