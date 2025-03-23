import { GuestDisposable } from "./GuestDisposable";
import { Patron } from "../Patron/Patron";
import { SourceWithPool } from "../Source/SourceWithPool";
import { expect, test, vitest } from "vitest";

test("GuestDisposable.test", () => {
  const source = new SourceWithPool(1);

  const guest = vitest.fn();

  // Работает проверка один раз, потом патром себя удаляет
  source.value(
    new Patron(
      new GuestDisposable(guest, (value) => {
        return value !== null && value > 1;
      }),
    ),
  );

  // Эти выражения не вызывает expect
  source.give(2);
  source.give(3);

  expect(guest).toBeCalledTimes(1);
  expect(guest).toBeCalledWith(1);
});
