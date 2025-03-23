import { expect, test } from "vitest";
import { Patron } from "./Patron";
import { SourceWithPool } from "../Source/SourceWithPool";

test("Patron.test", () => {
  const one = new SourceWithPool(1);
  let patronCalledTimes = 0;
  const patron = new Patron(() => {
    patronCalledTimes += 1;
  });

  one.value(patron);
  one.give(2);

  expect(patronCalledTimes).toBe(2);
});
