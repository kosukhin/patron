import { expect, test } from "vitest";
import { SourceWithPool } from "../Source/SourceWithPool";
import { PrivateClass } from "./PrivateClass";

test("PrivateClass.test", () => {
  const sourcePrivate = new PrivateClass(SourceWithPool);
  const source = sourcePrivate.get(42);

  source.value((value) => {
    expect(value).toBe(42);
  });
});
