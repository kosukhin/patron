import { expect, test } from "vitest";
import { Patron } from "./Patron";
import { Source } from "../Source/Source";

test("patron always guest", () => {
  const one = new Source(1);
  let patronCalledTimes = 0;
  const patron = new Patron(() => {
    patronCalledTimes += 1;
  });
  one.receiving(patron);
  one.receive(2);

  queueMicrotask(() => {
    expect(patronCalledTimes).toBe(2);
  });
});
