import { expect, test } from "vitest";
import { PatronPool } from "./PatronPool";
import { Patron } from "./Patron";

test("patron pool", () => {
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
      expect(receivedCount).toBe(4);
    }),
  );
  pool.receive(2);
});
