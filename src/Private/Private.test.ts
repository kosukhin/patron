import { Private } from "./Private";
import { expect, test } from "vitest";

test("Private.test", () => {
  const privateNum = new Private((val) => {
    return {
      num: val,
    };
  });

  expect(JSON.stringify(privateNum.get(11))).toBe('{"num":11}');
});
