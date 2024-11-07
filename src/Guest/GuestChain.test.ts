import { expect, test } from "vitest";
import { GuestChain } from "./GuestChain";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";

test("chain guest returns 2 values after result guest", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  chain.result((value) => {
    expect(Object.values(value).join()).toBe("1,2");
  });

  one.value(chain.receiveKey("one"));
  two.value(chain.receiveKey("two"));
});

test("chain guest returns 2 values before result guest", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.value(chain.receiveKey("one"));
  two.value(chain.receiveKey("two"));

  chain.result((value) => {
    expect(Object.values(value).join()).toBe("1,2");
  });
});

test("chain with patron", () => {
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

test("chain as array", () => {
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
