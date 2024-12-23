import { SourceEmpty } from "./SourceEmpty";
import { expect, test } from "vitest";

test("SourceEmpty.test", () => {
  const source = new SourceEmpty<number>();
  let accumulator = 0;

  // Не вызывается потому что нет значения
  source.value(() => {
    accumulator += 100;
  });

  // Вызывается после прихода значения
  source.give(200);
  source.value((value) => {
    accumulator += value;
  });

  expect(accumulator).toBe(200);
});
