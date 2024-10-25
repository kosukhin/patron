import { expect, test } from "vitest";
import { SourceOfValue } from "../Source/SourceOfValue";

test("guest callback", () => {
  const one = new SourceOfValue(1);

  one.receiving((value) => {
    expect(value).toBe(1);
  });
});
