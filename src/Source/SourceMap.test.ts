import { expect, test } from "vitest";
import { give, GuestType } from "../Guest/Guest";
import { SourceObjectType, SourceType, value } from "./Source";
import { SourceMap } from "./SourceMap";
import { GuestCast } from "../Guest/GuestCast";
import { SourceWithPool } from "./SourceWithPool";
import { PrivateClass } from "../Private/PrivateClass";
import { GuestSync } from "../Guest/GuestSync";

class X2 implements SourceObjectType<number> {
  public constructor(private baseNumber: SourceType<number>) {}

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

test("SourceMap.test", () => {
  const source = new SourceWithPool([1, 2, 3, 9]);
  const guestMapped = new SourceMap(source, new PrivateClass(X2));
  const guest = new GuestSync([]);

  guestMapped.value(guest);

  expect(guest.value().join()).toBe("2,4,6,18");
});
