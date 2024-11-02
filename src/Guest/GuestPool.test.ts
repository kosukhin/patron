import { expect, test } from "vitest";
import { GuestPool } from "./GuestPool";
import { Patron } from "../Patron/Patron";

test("patron pool with guests", () => {
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

  setTimeout(() => {
    pool.give(2);
  });

  setTimeout(() => {
    expect(receivedCount).toBe(10);
  }, 10);
});
