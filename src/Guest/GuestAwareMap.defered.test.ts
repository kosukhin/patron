import { Module } from "../Factory/Module";
import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { give, GuestType } from "./Guest";
import { GuestAware, GuestAwareType, value } from "./GuestAware";
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

test('GuestAwareMap.defered.test', () => {
  const guestAwareOf = (val: number) => new GuestAware((guest) => give(val, guest));
  const source = new Source([1, 2, 3, 9].map(guestAwareOf))
  const guestMapped = new GuestAwareMap(
    source,
    new Module(x2)
  );
  expect(true).toBe(true);
  guestMapped.value((v) => {
    expect(v.join()).toBe('2,4,6,18')
  });
});
