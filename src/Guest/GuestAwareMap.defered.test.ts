import { wait } from './../../test-utils/wait';
import { Module } from "../Factory/Module";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Source } from "../Source/Source";
import { give, GuestType } from "./Guest";
import { GuestAware, GuestAwareType, value } from "./GuestAware";
import { GuestAwareMap } from "./GuestAwareMap";
import { GuestCast } from "./GuestCast";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

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

test('GuestAwareMap.defered.test', async () => {
  const guestAwareOf = (val: number) => new GuestAware(async (guest) => {
    await wait(5);
    give(val, guest);
  });
  const source = new Source([1, 2, 3, 9].map(guestAwareOf))
  const guestMapped = new GuestAwareMap(
    source,
    new Module(x2)
  );
  const callFn = vi.fn();
  guestMapped.value((v) => {
    expect(v.join()).toBe('2,4,6,18');
    callFn();
  });
  await wait(50);
  expect(callFn).toBeCalled();
});
