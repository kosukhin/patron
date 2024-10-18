import { expect, test } from "vitest";
import { GuestCallback } from "./GuestCallback";
import { GuestInTheMiddle } from "./GuestInTheMiddle";
import { GuestChain } from "./GuestChain";
import { SourceOfValue } from "../Source/SourceOfValue";
import { PatronOfGuest } from "../Patron/PatronOfGuest";

test("test guest in the middle", () => {
  const one = new SourceOfValue(1);

  let accumValue = 0;
  const guest = new GuestCallback((value: number) => {
    accumValue += value;
  });
  one.receiving(
    new GuestInTheMiddle(guest, (value: number) => {
      guest.receive(value + 3);
    }),
  );

  expect(accumValue).toBe(4);
});

test("test patron in the middle", () => {
  const one = new SourceOfValue(1);

  let accumValue = 0;
  const guest = new PatronOfGuest(
    new GuestCallback((value: number) => {
      accumValue += value;
    }),
  );
  one.receiving(
    new GuestInTheMiddle(guest, (value: number) => {
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
  const one = new SourceOfValue(1);
  const two = new SourceOfValue(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.receiving(new PatronOfGuest(chain.receiveKey("one")));
  two.receiving(new PatronOfGuest(chain.receiveKey("two")));

  one.receive(3);
  one.receive(4);

  const guest = new PatronOfGuest(
    new GuestCallback((value: { one: number; two: number; three: number }) => {
      expect(Object.values(value).length).toBe(3);
    }),
  );

  chain.result(
    new GuestInTheMiddle(guest, (value) => {
      guest.receive({ ...value, three: 99 });
    }),
  );
});
