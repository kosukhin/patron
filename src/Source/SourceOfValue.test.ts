import { expect, test } from "vitest";
import { SourceOfValue } from "./SourceOfValue";

test("source", () => {
  const source = new SourceOfValue(42);

  source.receiving((value) => {
    expect(value).toBe(42);
  });
});
