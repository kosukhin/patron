import { expect, test } from "vitest";
import { GuestAware } from "./GuestAware";
import { give } from "./Guest";

test("guest aware", () => {
  const aware = new GuestAware((guest) => {
    give(111, guest);
  });

  aware.value((value) => {
    expect(value).toBe(111);
  });
});
