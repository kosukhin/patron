import { expect, test } from "vitest";
import { sourcesApplied } from "./SourcesApplied";

test("sources applied", () => {
  const target = {
    one(data: { one: string }, after: string) {
      return data.one + " " + after;
    },
  };
  const targetApplied = sourcesApplied(target, {
    one: [{ one: "hello world" }, "after"],
  });
  expect(targetApplied.one()).toBe("hello world after");
});

test("sources applied classes", () => {
  class Target {
    one(data: { one: string }, after: string) {
      return data.one + " " + after;
    }
  }
  const targetApplied = sourcesApplied(new Target(), {
    one: [{ one: "good bye" }, "after"],
  });
  expect(targetApplied.one()).toBe("good bye after");
});
