import { expect, test, vitest } from "vitest";
import { SourceWithPool } from "./SourceWithPool";
import { SourceAll } from "./SourceAll";

test("SourceAll._twoValuesAfter.test", () => {
  const one = new SourceWithPool(1);
  const two = new SourceWithPool(2);
  const all = new SourceAll<{ one: number; two: number }>(["one", "two"]);

  const g = vitest.fn();
  all.value((value) => {
    g(Object.values(value).join());
  });

  one.value(all.guestKey("one"));
  two.value(all.guestKey("two"));

  expect(g).toBeCalledWith("1,2");
});
