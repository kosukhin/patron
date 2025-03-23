import { expect, test } from "vitest";
import { SourceWithPool } from "./SourceWithPool";
import { SourceAll } from "./SourceAll";

test("SourceAll._twoValuesAfter.test", () => {
  const one = new SourceWithPool(1);
  const two = new SourceWithPool(2);
  const all = new SourceAll<{ one: number; two: number }>(["one", "two"]);

  all.value((value) => {
    expect(Object.values(value).join()).toBe("1,2");
  });

  one.value(all.guestKey("one"));
  two.value(all.guestKey("two"));
});
