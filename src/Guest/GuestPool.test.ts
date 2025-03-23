import { expect, test } from "vitest";
import { Patron } from "../Patron/Patron";
import { GuestPool } from "./GuestPool";

test("GuestPool.test", async () => {
  const pool = new GuestPool<number>(null);
  let receivedCount = 0;

  // 2 + 2
  pool.add(
    new Patron((value) => {
      receivedCount += value;
    }),
  );
  // 2 + 2
  pool.add(
    new Patron((value) => {
      receivedCount += value;
    }),
  );
  // 2
  pool.add((value) => {
    receivedCount += value;
  });

  pool.give(2);
  pool.give(2);

  expect(receivedCount).toBe(10);
});
