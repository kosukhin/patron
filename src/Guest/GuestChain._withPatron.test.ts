import { expect, test } from "vitest";
import { GuestChain } from "./GuestChain";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";

test("GuestChain._withPatron.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.value(new Patron(chain.receiveKey("one")));
  two.value(new Patron(chain.receiveKey("two")));

  one.give(3);
  one.give(4);

  chain.result(
    new Patron((value: Record<string, unknown>) => {
      expect(Object.values(value).length).toBe(2);
    }),
  );
});
