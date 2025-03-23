import { SourceActive } from "./SourceActive";
import { expect, test, vitest } from "vitest";

test("SourceActive.test", () => {
  const active = new SourceActive<number, number>((config, source) => {
    source.give(config * 3);
  });

  const guest = vitest.fn();
  active.do(4).value(guest);

  expect(guest).toBeCalledWith(12);
});
