import { GuestDisposable } from "./GuestDisposable";
import { Patron } from "../Patron/Patron";
import { Source } from "../Source/Source";
import { expect, test } from "vitest";

test("GuestDisposable.test", () => {
  const source = new Source(1);

  // Работает проверка один раз, потом патром себя удаляет
  source.value(
    new Patron(
      new GuestDisposable(
        (value) => {
          expect(value).toBe(1);
        },
        (value) => {
          return value !== null && value > 1;
        },
      ),
    ),
  );

  // Эти выражения не вызывает expect
  setTimeout(() => {
    source.give(2);
    setTimeout(() => {
      source.give(3);
    });
  });
});
