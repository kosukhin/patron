import { expect, test } from "vitest";
import { PatronPool } from "./PatronPool";
import { Patron } from "./Patron";

test("PatronPool.test", () => {
  const pool = new PatronPool<number>(null);
  let receivedCount = 0;

  pool.add(
    new Patron((value) => {
      receivedCount += value;
    }),
  );
  pool.add(
    new Patron((value) => {
      receivedCount += value;
    }),
  );
  pool.give(2);

  expect(receivedCount).toBe(4);
});
