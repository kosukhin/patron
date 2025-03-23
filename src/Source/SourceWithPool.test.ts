import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "./SourceWithPool";

test("SourceChangeable.test", () => {
  const source = new SourceWithPool(42);

  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(42);
});
