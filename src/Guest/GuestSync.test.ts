import { expect, test } from "vitest";
import { GuestSync } from "./GuestSync";
import { Source } from "../Source/Source";

test("guest sync", () => {
  const source = new Source(123);
  const syncGuest = new GuestSync(111);
  syncGuest.receive(222);
  expect(syncGuest.value()).toBe(222);
  source.receiving(syncGuest);
  expect(syncGuest.value()).toBe(123);
});
