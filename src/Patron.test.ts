import { expect, test } from "vitest";
import { Patron } from "./Patron";
import { Guest } from "./Guest";
import { Source } from "./Source";

test("patron always guest", () => {
  const one = new Source(1);
  let patronCalledTimes = 0;
  const patron = new Patron(
    new Guest(() => {
      patronCalledTimes += 1;
    }),
  );
  one.receiving(patron);
  one.receive(2);

  queueMicrotask(() => {
    expect(patronCalledTimes).toBe(2);
  });
});
