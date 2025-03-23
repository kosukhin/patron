import { expect, test, vitest } from "vitest";
import { Source } from "./Source";
import { give } from "../Guest/Guest";

test("Source.test", () => {
  const aware = new Source((guest) => {
    give(111, guest);
  });

  const guest = vitest.fn();
  aware.value(guest);

  expect(guest).toBeCalledWith(111);
});
