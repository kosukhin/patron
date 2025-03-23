import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "../Source/SourceWithPool";
import { PrivateClass } from "./PrivateClass";

test("PrivateClass.test", () => {
  const sourcePrivate = new PrivateClass(SourceWithPool);
  const source = sourcePrivate.get(42);

  const guest = vitest.fn();
  source.value(guest);

  expect(guest).toBeCalledWith(42);
});
