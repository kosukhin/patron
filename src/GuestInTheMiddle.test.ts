import { expect, test } from "vitest";
import { Guest } from "./Guest";
import { GuestInTheMiddle } from "./GuestInTheMiddle";
import { Patron } from "./Patron";
import { Chain } from "./Chain";
import { Source } from "./Source";

test("test guest in the middle", () => {
  const one = new Source(1);

  let accumValue = 0;
  const guest = new Guest((value: number) => {
    accumValue += value;
  });
  one.receiving(
    new GuestInTheMiddle(guest, (value) => {
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
    new GuestInTheMiddle(guest, (value) => {
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
  const chain = new Chain<{ one: number; two: number }>();

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
    new GuestInTheMiddle(guest, (value) => {
      guest.receive({ ...value, three: 99 });
    }),
  );
});
