import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { GuestAwareAll } from "./GuestAwareAll";

test("GuestAwareAll._twoValuesBefore.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const all = new GuestAwareAll<{ one: number; two: number }>();

  one.value(all.guestKey("one"));
  two.value(all.guestKey("two"));

  all.value((value) => {
    expect(Object.values(value).join()).toBe("1,2");
  });
});
