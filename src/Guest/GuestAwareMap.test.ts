import { expect, test } from "vitest";
import { give, GuestType } from "./Guest";
import { GuestAwareObjectType, GuestAwareType, value } from "./GuestAware";
import { GuestAwareMap } from "./GuestAwareMap";
import { GuestCast } from "./GuestCast";
import { Source } from "../Source/Source";
import { PrivateClass } from "../Private/PrivateClass";

class X2 implements GuestAwareObjectType<number> {
  public constructor(private baseNumber: GuestAwareType<number>) {}

  public value(guest: GuestType<number>) {
    value(
      this.baseNumber,
      new GuestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return this;
  }
}

test("GuestAwareMap.test", () => {
  const source = new Source([1, 2, 3, 9]);
  const guestMapped = new GuestAwareMap(source, new PrivateClass(X2));
  guestMapped.value((v) => {
    expect(v.join()).toBe("2,4,6,18");
  });
});
