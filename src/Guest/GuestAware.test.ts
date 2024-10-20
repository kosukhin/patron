import { expect, test } from "vitest";
import { GuestAware } from "./GuestAware";
import { GuestCallback } from "./GuestCallback";

test("guest aware", () => {
  const awared = new GuestAware((guest) => {
    guest.receive(111);
  });

  awared.receiving(
    new GuestCallback((value) => {
      expect(value).toBe(111);
    }),
  );
});
