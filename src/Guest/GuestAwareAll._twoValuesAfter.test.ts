import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { GuestAwareAll } from "./GuestAwareAll";

test("GuestAwareAll._twoValuesAfter.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const all = new GuestAwareAll<{ one: number; two: number }>();

  all.value((value) => {
    expect(Object.values(value).join()).toBe("1,2");
  });

  one.value(all.guestKey("one"));
  two.value(all.guestKey("two"));
});
