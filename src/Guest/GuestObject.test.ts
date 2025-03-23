import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "../Source/SourceWithPool";
import { GuestObject } from "./GuestObject";

test("GuestObject.test", () => {
  const source = new SourceWithPool(1);
  const fnGuest = vitest.fn();
  source.value(new GuestObject(fnGuest));
  expect(fnGuest).toBeCalled();
  expect(fnGuest).toBeCalledWith(1);
});
