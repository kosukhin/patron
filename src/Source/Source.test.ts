import { expect, test } from "vitest";
import { Source } from "./Source";
import { give } from "../Guest/Guest";

test("Source.test", () => {
  const aware = new Source((guest) => {
    give(111, guest);
  });

  aware.value((value) => {
    expect(value).toBe(111);
  });
});
