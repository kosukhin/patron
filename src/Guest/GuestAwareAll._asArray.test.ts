import { expect, test } from "vitest";
import { GuestAwareAll } from "./GuestAwareAll";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";

test("GuestAwareAll._asArray.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const all = new GuestAwareAll<[number, number]>();

  one.value(new Patron(all.guestKey("0")));
  two.value(new Patron(all.guestKey("1")));

  all.valueArray(
    new Patron((value) => {
      expect(JSON.stringify(value)).toBe("[1,2]");
    }),
  );
});
