import { expect, test } from "vitest";
import { Source } from "../Source/Source";

test("guest callback", () => {
  const one = new Source(1);

  one.value((value) => {
    expect(value).toBe(1);
  });
});
