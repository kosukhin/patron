import { expect, test } from "vitest";
import { Patron } from "./Patron";
import { Source } from "../Source/Source";

test("Patron.test", () => {
  const one = new Source(1);
  let patronCalledTimes = 0;
  const patron = new Patron(() => {
    patronCalledTimes += 1;
  });
  one.value(patron);
  one.give(2);

  queueMicrotask(() => {
    expect(patronCalledTimes).toBe(2);
  });
});
