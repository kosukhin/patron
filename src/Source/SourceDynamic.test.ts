import { SourceDynamic } from "./SourceDynamic";
import { expect, test } from "vitest";
import { give, Guest } from "../Guest/Guest";
import { GuestAware } from "../Guest/GuestAware";

test("SourceDynamic", () => {
  let theValue = 1;
  const sourceDynamic = new SourceDynamic(
    new Guest((value: number) => {
      theValue = value;
    }),
    new GuestAware((guest) => {
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
