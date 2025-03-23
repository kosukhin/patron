import { SourceSequence } from "./SourceSequence";
import { give } from "../Guest/Guest";
import { SourceObjectType, SourceType, value } from "./Source";
import { GuestCast } from "../Guest/GuestCast";
import { GuestType } from "../Guest/Guest";
import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "./SourceWithPool";
import { PrivateClass } from "../Private/PrivateClass";

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

test("SourceSequence.test", () => {
  const source = new SourceWithPool([1, 2, 3, 9]);
  const guestMapped = new SourceSequence(source, new PrivateClass(X2));
  const g = vitest.fn();
  guestMapped.value(g);
  expect(g).toBeCalledWith([2, 4, 6, 18]);
});
