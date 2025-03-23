import { expect, test, vi, vitest } from "vitest";
import { SourceOnce } from "./SourceOnce";

test("SourceOnce.notcalled.test", () => {
  const source = new SourceOnce();
  const guestNotCalled = vi.fn();
  source.value(guestNotCalled);
  expect(guestNotCalled).not.toHaveBeenCalled();
  source.give(111);
  const g = vitest.fn();
  source.value(g);
  expect(g).toBeCalledWith(111);
});
