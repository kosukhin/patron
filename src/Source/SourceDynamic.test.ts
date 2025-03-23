import { SourceDynamic } from "./SourceDynamic";
import { expect, test } from "vitest";
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

  sourceDynamic.value((value) => {
    expect(value).toBe(1);
  });

  sourceDynamic.give(2);

  sourceDynamic.value((value) => {
    expect(value).toBe(2);
  });
});
