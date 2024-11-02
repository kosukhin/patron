import { expect, test } from "vitest";
import { Guest } from "./Guest";
import { GuestMiddle } from "./GuestMiddle";
import { GuestChain } from "./GuestChain";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";

test("test guest in the middle", () => {
  const one = new Source(1);

  let accumValue = 0;
  const guest = new Guest((value: number) => {
    accumValue += value;
  });
  one.value(
    new GuestMiddle(guest, (value: number) => {
      guest.give(value + 3);
    }),
  );

  expect(accumValue).toBe(4);
});

test("test patron in the middle", () => {
  const one = new Source(1);

  let accumValue = 0;
  const guest = new Patron(
    new Guest((value: number) => {
      accumValue += value;
    }),
  );
  one.value(
    new GuestMiddle(guest, (value: number) => {
      guest.give(value + 3);
    }),
  );
  one.give(3);

  setTimeout(() => {
    one.give(3);
  });

  setTimeout(() => {
    expect(accumValue).toBe(16);
  });
});

test("test chain in the middle", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.value(new Patron(chain.receiveKey("one")));
  two.value(new Patron(chain.receiveKey("two")));

  one.give(3);
  one.give(4);

  const guest = new Patron(
    new Guest((value: { one: number; two: number; three: number }) => {
      expect(Object.values(value).length).toBe(3);
    }),
  );

  chain.result(
    new GuestMiddle(guest, (value) => {
      guest.give({ ...value, three: 99 });
    }),
  );
});
