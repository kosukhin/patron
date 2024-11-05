import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { GuestObject } from "./GuestObject";

test("guest object", () => {
  const source = new Source(1);
  const fnGuest = (value: number) => {
    expect(value).toBe(1);
  };
  source.value(new GuestObject(fnGuest));
});
