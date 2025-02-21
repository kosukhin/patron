import { GuestAwareActive } from "./GuestAwareActive";
import { expect, test } from "vitest";

test("GuestAwareActive.test", () => {
  const active = new GuestAwareActive<number, number>((config, source) => {
    source.give(config * 3);
  });

  active.do(4).value((v) => {
    expect(v).toBe(12);
  });
});
