import { SourceDynamic } from "./SourceDynamic";
import { expect, test, vitest } from "vitest";
import { give, Guest } from "../Guest/Guest";
import { Source } from "./Source";

test("SourceDynamic", () => {
  let theValue = 1;
  const sourceDynamic = new SourceDynamic(
    new Guest((value: number) => {
      theValue = value;
    }),
    new Source((guest) => {
      give(theValue, guest);
    }),
  );

  const g1 = vitest.fn();
  sourceDynamic.value(g1);
  expect(g1).toBeCalledWith(1);

  sourceDynamic.give(2);

  const g2 = vitest.fn();
  sourceDynamic.value(g2);
  expect(g2).toBeCalledWith(2);
});
