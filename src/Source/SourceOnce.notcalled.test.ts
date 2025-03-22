import { expect, test, vi } from "vitest";
import { SourceOnce } from "./SourceOnce";

test("SourceOnce.notcalled.test", () => {
  const source = new SourceOnce();
  const guestNotCalled = vi.fn();
  source.value(guestNotCalled);
  expect(guestNotCalled).not.toHaveBeenCalled();
  source.give(111);
  source.value((v) => {
    expect(v).toBe(111);
  });
});
