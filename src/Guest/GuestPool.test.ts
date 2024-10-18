import { expect, test } from "vitest";
import { GuestCallback } from "./GuestCallback";
import { GuestPool } from "./GuestPool";
import { PatronOfGuest } from "../Patron/PatronOfGuest";

test("patron pool with guests", () => {
  const pool = new GuestPool(null);
  let receivedCount = 0;

  // 2 + 2
  pool.add(
    new PatronOfGuest(
      new GuestCallback<number>((value) => {
        receivedCount += value;
      }),
    ),
  );
  // 2 + 2
  pool.add(
    new PatronOfGuest(
      new GuestCallback<number>((value) => {
        receivedCount += value;
      }),
    ),
  );
  // 2
  pool.add(
    new GuestCallback<number>((value) => {
      receivedCount += value;
    }),
  );
  pool.receive(2);

  setTimeout(() => {
    pool.receive(2);
  });

  setTimeout(() => {
    expect(receivedCount).toBe(10);
  }, 10);
});
