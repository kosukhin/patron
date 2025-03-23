import { SourceActive } from "./SourceActive";
import { expect, test } from "vitest";

test("SourceActive.test", () => {
  const active = new SourceActive<number, number>((config, source) => {
    source.give(config * 3);
  });

  active.do(4).value((v) => {
    expect(v).toBe(12);
  });
});
