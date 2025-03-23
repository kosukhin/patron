import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "./SourceWithPool";
import { Patron } from "../Patron/Patron";

test("SourceChangeable.test", () => {
  const source = new SourceWithPool();
  const guest = vitest.fn();

  source.value(new Patron(guest));
  source.give(42);

  expect(guest).toBeCalled();
  expect(guest).toBeCalledWith(42);
});
