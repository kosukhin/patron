import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { PrivateClass } from "./PrivateClass";

test("PrivateClass.test", () => {
  const sourcePrivate = new PrivateClass(Source);
  const source = sourcePrivate.get(42);

  source.value((value) => {
    expect(value).toBe(42);
  });
});
