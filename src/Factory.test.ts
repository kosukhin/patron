import { expect, test } from "vitest";
import { Factory } from "./Factory";
import { Guest } from "./Guest";
import { Source } from "./Source";

test("factory", () => {
  const sourceFactory = new Factory(Source);

  const source = sourceFactory.create(42);

  source.receiving(
    new Guest((value) => {
      expect(value).toBe(42);
    }),
  );
});
