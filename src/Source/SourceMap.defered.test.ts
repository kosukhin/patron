import { wait } from "../../test-utils/wait";
import { Private } from "../Private/Private";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { SourceWithPool } from "./SourceWithPool";
import { give, GuestType } from "../Guest/Guest";
import { Source, SourceType, value } from "./Source";
import { SourceMap } from "./SourceMap";
import { GuestCast } from "../Guest/GuestCast";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function x2(baseNumber: SourceType<number>) {
  return (guest: GuestType<number>) => {
    value(
      baseNumber,
      new GuestCast(guest, (v) => {
        give(v * 2, guest);
      }),
    );
    return guest;
  };
}

test("SourceMap.defered.test", async () => {
  const sourceOf = (val: number) =>
    new Source(async (guest) => {
      await wait(5);
      give(val, guest);
    });
  const source = new SourceWithPool([1, 2, 3, 9].map(sourceOf));
  const guestMapped = new SourceMap(source, new Private(x2));
  const callFn = vi.fn();
  guestMapped.value((v) => {
    callFn(v.join());
  });
  await wait(50);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
