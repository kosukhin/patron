import { SourceSequence } from "./SourceSequence";
import { give } from "../Guest/Guest";
import { Source, SourceObjectType, SourceType, value } from "./Source";
import { GuestCast } from "../Guest/GuestCast";
import { GuestType } from "../Guest/Guest";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { SourceWithPool } from "./SourceWithPool";
import { PrivateClass } from "../Private/PrivateClass";
import { wait } from "../../test-utils/wait";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

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

test("SourceSequence.defered.test", async () => {
  const sourceOf = (val: number) =>
    new Source((guest) => {
      setTimeout(() => {
        give(val, guest);
      }, 10);
    });
  const source = new SourceWithPool([1, 2, 3, 9].map(sourceOf));

  const sequence = new SourceSequence(source, new PrivateClass(X2));

  const callFn = vi.fn();
  sequence.value((v) => {
    callFn(v.join());
  });

  await wait(51);
  expect(callFn).toBeCalled();
  expect(callFn).toBeCalledWith("2,4,6,18");
});
