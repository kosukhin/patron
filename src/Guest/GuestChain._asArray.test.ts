import { expect, test } from "vitest";
import { GuestChain } from "./GuestChain";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";

test("GuestChain._asArray.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<[number, number]>();

  one.value(new Patron(chain.receiveKey("0")));
  two.value(new Patron(chain.receiveKey("1")));

  chain.resultArray(
    new Patron((value) => {
      expect(JSON.stringify(value)).toBe("[1,2]");
    }),
  );
});
