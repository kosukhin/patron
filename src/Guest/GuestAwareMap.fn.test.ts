import { Private } from "../Private/Private";
import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { give, GuestType } from "./Guest";
import { GuestAwareType, value } from "./GuestAware";
import { GuestAwareMap } from "./GuestAwareMap";
import { GuestCast } from "./GuestCast";

function x2(baseNumber: GuestAwareType<number>) {
  return (guest: GuestType<number>) => {
    value(
      baseNumber,
      new GuestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      })
    );
    return guest;
  };
}

test('GuestAwareMap.test', () => {
  const source = new Source([1, 2, 3, 9])
  const guestMapped = new GuestAwareMap(
    source,
    new Private(x2)
  );
  guestMapped.value((v) => {
    expect(v.join()).toBe('2,4,6,18')
  });
});
