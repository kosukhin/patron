import { GuestAwareSequence } from "./GuestAwareSequence";
import { give } from "./Guest";
import { GuestAware, GuestAwareObjectType, GuestAwareType, value } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestType } from "./Guest";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Source } from "../Source/Source";
import { PrivateClass } from "../Private/PrivateClass";
import { wait } from "../../test-utils/wait";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

class X2 implements GuestAwareObjectType<number> {
  public constructor(private baseNumber: GuestAwareType<number>) { }

  public value(guest: GuestType<number>) {
    value(
      this.baseNumber,
      new GuestCast(<GuestType>guest, (v) => {
        give(v * 2, guest);
      })
    );
    return this;
  }
}

test('GuestAwareSequence.defered.test', async () => {
  const guestAwareOf = (val: number) => new GuestAware((guest) => {
    setTimeout(() => {
      give(val, guest);
    }, 10);
  });
  const source = new Source([1, 2, 3, 9].map(guestAwareOf));

  const sequence = new GuestAwareSequence(
    source,
    new PrivateClass(X2)
  );

  const callFn = vi.fn();
  sequence.value((v) => {
    expect(v.join()).toBe('2,4,6,18');
    callFn();
  });

  await wait(51);
  expect(callFn).toBeCalled();
})
