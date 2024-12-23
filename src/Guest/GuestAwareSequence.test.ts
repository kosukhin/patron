import { GuestAwareSequence } from "./GuestAwareSequence";
import { give } from "./Guest";
import { GuestAwareType } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestType } from "./Guest";
import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { Factory } from "../Factory/Factory";

class X2 implements GuestAwareType<number> {
  public constructor(private baseNumber: GuestAwareType<number>) { }

  public value(guest: GuestType<number>) {
    this.baseNumber.value(
      new GuestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      })
    )
    return this;
  }
}

test('GuestAwareSequence.test', () => {
  const source = new Source([1, 2, 3, 9])
  const guestMapped = new GuestAwareSequence(
    source,
    new Factory(X2)
  );
  expect(true).toBe(true);
  guestMapped.value((v) => {
    expect(v.join()).toBe('2,4,6,18')
  });
})
