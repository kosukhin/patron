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
  one.receiving(
    new GuestMiddle(guest, (value: number) => {
      guest.receive(value + 3);
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
  one.receiving(
    new GuestMiddle(guest, (value: number) => {
      guest.receive(value + 3);
    }),
  );
  one.receive(3);

  setTimeout(() => {
    one.receive(3);
  });

  setTimeout(() => {
    expect(accumValue).toBe(16);
  });
});

test("test chain in the middle", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.receiving(new Patron(chain.receiveKey("one")));
  two.receiving(new Patron(chain.receiveKey("two")));

  one.receive(3);
  one.receive(4);

  const guest = new Patron(
    new Guest((value: { one: number; two: number; three: number }) => {
      expect(Object.values(value).length).toBe(3);
    }),
  );

  chain.result(
    new GuestMiddle(guest, (value) => {
      guest.receive({ ...value, three: 99 });
    }),
  );
});
