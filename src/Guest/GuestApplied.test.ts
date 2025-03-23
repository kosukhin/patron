import { GuestApplied } from "../Guest/GuestApplied";
import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "../Source/SourceWithPool";

test("GuestApplied.test", () => {
  const one = new SourceWithPool(1);
  const guest = vitest.fn();

  one.value(new GuestApplied(guest, (v) => v * 2));

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(2);
});
