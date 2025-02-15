import { PrivateClass } from "./PrivateClass";
import { GuestType } from "../Guest/Guest";
import { Source, SourceType } from "../Source/Source";
import { expect, test } from "vitest";
import { PrivateType } from "./Private";

test("PrivateClass.test", () => {
  const sourcePrivate = new PrivateClass(Source);
  const source = sourcePrivate.get(42);

  source.value((value) => {
    expect(value).toBe(42);
  });
});
