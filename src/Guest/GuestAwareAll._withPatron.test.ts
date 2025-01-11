import { expect, test } from "vitest";
import { GuestAwareAll } from "./GuestAwareAll";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";

test("GuestAwareAll._withPatron.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const all = new GuestAwareAll<{ one: number; two: number }>();

  one.value(new Patron(all.guestKey("one")));
  two.value(new Patron(all.guestKey("two")));

  one.give(3);
  one.give(4);

  all.value(
    new Patron((value: Record<string, unknown>) => {
      expect(Object.values(value).length).toBe(2);
    }),
  );
});
