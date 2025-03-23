import { expect, test, vitest } from "vitest";
import { SourceAll } from "./SourceAll";
import { SourceWithPool } from "./SourceWithPool";
import { Patron } from "../Patron/Patron";

test("SourceAll._withPatron.test", () => {
  const one = new SourceWithPool(1);
  const two = new SourceWithPool(2);
  const all = new SourceAll<{ one: number; two: number }>();

  one.value(new Patron(all.guestKey("one")));
  two.value(new Patron(all.guestKey("two")));

  one.give(3);
  one.give(4);

  const g = vitest.fn();
  all.value(
    new Patron((value: Record<string, unknown>) => {
      g(Object.values(value).length);
    }),
  );

  expect(g).toBeCalledWith(2);
});
