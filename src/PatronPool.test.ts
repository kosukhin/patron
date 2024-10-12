import { expect, test } from "vitest";
import { Guest } from "./Guest";
import { PatronPool } from "./PatronPool";
import { Patron } from "./Patron";

test("patron pool", () => {
  const pool = new PatronPool(null);
  let receivedCount = 0;

  pool.add(
    new Patron(
      new Guest<number>((value) => {
        receivedCount += value;
      }),
    ),
  );
  pool.add(
    new Patron(
      new Guest<number>((value) => {
        receivedCount += value;
      }),
    ),
  );
  pool.receive(2);

  expect(receivedCount).toBe(4);
});
