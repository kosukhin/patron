import { expect, test } from "vitest";
import { GuestCallback } from "./GuestCallback";
import { SourceOfValue } from "../Source/SourceOfValue";

test("guest dynamic", () => {
  const one = new SourceOfValue(1);

  one.receiving(
    new GuestCallback((value) => {
      expect(value).toBe(1);
    }),
  );
});
