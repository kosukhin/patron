import { expect, test } from "vitest";
import { PatronOfGuest } from "./PatronOfGuest";
import { SourceOfValue } from "../Source/SourceOfValue";
import { GuestCallback } from "../Guest/GuestCallback";

test("patron always guest", () => {
  const one = new SourceOfValue(1);
  let patronCalledTimes = 0;
  const patron = new PatronOfGuest(
    new GuestCallback(() => {
      patronCalledTimes += 1;
    }),
  );
  one.receiving(patron);
  one.receive(2);

  queueMicrotask(() => {
    expect(patronCalledTimes).toBe(2);
  });
});
