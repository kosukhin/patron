import { SourceEmpty } from "./SourceEmpty";
import { expect, test } from "vitest";

test("source", () => {
  const source = new SourceEmpty<number>();
  let accumulator = 0;

  // Не вызывается потому что нет значения
  source.receiving(() => {
    accumulator += 100;
  });

  // Вызывается после прихода значения
  source.receive(200);
  source.receiving((value) => {
    accumulator += value;
  });

  expect(accumulator).toBe(200);
});
