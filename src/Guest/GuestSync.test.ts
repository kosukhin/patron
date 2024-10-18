import { expect, test } from "vitest";
import { GuestSync } from "./GuestSync";
import { SourceOfValue } from "../Source/SourceOfValue";
import { GuestCallback } from "./GuestCallback";

test("guest sync", () => {
  const source = new SourceOfValue(123);
  const syncGuest = new GuestSync(new GuestCallback(() => {}));
  syncGuest.receive(222);
  expect(syncGuest.value()).toBe(222);
  source.receiving(syncGuest);
  expect(syncGuest.value()).toBe(123);
});
