import { expect, test } from "vitest";
import { SourceWithPool } from "./SourceWithPool";

test("SourceChangeable.test", () => {
  const source = new SourceWithPool(42);

  source.value((value) => {
    expect(value).toBe(42);
  });
});
