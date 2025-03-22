import { SourceOnce } from "./SourceOnce";
import { expect, test } from "vitest";

test("SourceOnce.test", () => {
  const source = new SourceOnce(123);
  source.give(321);

  source.value((v) => {
    expect(v).toBe(123);
  });
});
