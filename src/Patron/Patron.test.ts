import { expect, test } from "vitest";
import { Patron } from "./Patron";
import { SourceOfValue } from "../Source/SourceOfValue";

test("patron always guest", () => {
  const one = new SourceOfValue(1);
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
