import { expect, test } from "vitest";
import { SourceWithPool } from "../Source/SourceWithPool";
import { GuestObject } from "./GuestObject";

test("GuestObject.test", () => {
  const source = new SourceWithPool(1);
  const fnGuest = (value: number) => {
    expect(value).toBe(1);
  };
  source.value(new GuestObject(fnGuest));
});
