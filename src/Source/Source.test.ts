import { expect, test } from "vitest";
import { Source } from "./Source";

test("Source.test", () => {
  const source = new Source(42);

  source.value((value) => {
    expect(value).toBe(42);
  });
});
