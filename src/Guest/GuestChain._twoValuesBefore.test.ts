import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { GuestChain } from "./GuestChain";

test("GuestChain._twoValuesBefore.test", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.value(chain.receiveKey("one"));
  two.value(chain.receiveKey("two"));

  chain.result((value) => {
    expect(Object.values(value).join()).toBe("1,2");
  });
});
