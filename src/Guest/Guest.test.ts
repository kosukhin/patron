import { expect, test } from "vitest";
import { Source } from "../Source/Source";

test("Guest.test", () => {
  const one = new Source(1);

  one.value((value) => {
    expect(value).toBe(1);
  });
});
