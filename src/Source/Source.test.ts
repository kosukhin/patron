import { expect, test } from "vitest";
import { Source } from "./Source";

test("source", () => {
  const source = new Source(42);

  source.receiving((value) => {
    expect(value).toBe(42);
  });
});
