import { expect, test, vitest } from "vitest";
import { SourceAll } from "./SourceAll";
import { SourceWithPool } from "./SourceWithPool";
import { Patron } from "../Patron/Patron";

test("SourceAll._asArray.test", () => {
  const one = new SourceWithPool(1);
  const two = new SourceWithPool(2);
  const all = new SourceAll<[number, number]>();

  one.value(new Patron(all.guestKey("0")));
  two.value(new Patron(all.guestKey("1")));

  const guest = vitest.fn();
  all.valueArray(
    new Patron((value) => {
      guest(JSON.stringify(value));
    }),
  );

  expect(guest).toBeCalledWith("[1,2]");
});
