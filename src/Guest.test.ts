import { expect, test } from "vitest";
import { Guest } from "./Guest";
import { Source } from "@/Source";

test("guest dynamic", () => {
  const one = new Source(1);

  one.receiving(
    new Guest((value) => {
      expect(value).toBe(1);
    }),
  );
});
