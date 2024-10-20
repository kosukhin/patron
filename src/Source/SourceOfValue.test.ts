import { expect, test } from "vitest";
import { SourceOfValue } from "./SourceOfValue";
import { GuestCallback } from "../Guest/GuestCallback";

test("source", () => {
  const source = new SourceOfValue(42);

  source.receiving(
    new GuestCallback((value) => {
      expect(value).toBe(42);
    }),
  );
});
