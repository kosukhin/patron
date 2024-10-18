import { expect, test } from "vitest";
import { PatronPool } from "./PatronPool";
import { PatronOfGuest } from "./PatronOfGuest";
import { GuestCallback } from "../Guest/GuestCallback";

test("patron pool", () => {
  const pool = new PatronPool(null);
  let receivedCount = 0;

  pool.add(
    new PatronOfGuest(
      new GuestCallback<number>((value) => {
        receivedCount += value;
      }),
    ),
  );
  pool.add(
    new PatronOfGuest(
      new GuestCallback<number>((value) => {
        receivedCount += value;
        expect(receivedCount).toBe(4);
      }),
    ),
  );
  pool.receive(2);
});
