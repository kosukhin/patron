import { expect, test } from "vitest";
import { Patron } from "../Patron/Patron";
import { give, Guest } from "./Guest";
import { GuestCast } from "./GuestCast";
import { SourceWithPool } from "../Source/SourceWithPool";

test("GuestCast.test", () => {
  const source = new SourceWithPool();
  let acc = 0;
  const mainGuest = new Patron(
    new Guest((value: number) => {
      acc += value;
    }),
  );

  // Становится патроном тоже, тк наследует это сойство от mainGuest
  const secondGuest = new GuestCast(
    mainGuest,
    new Guest((value: number) => {
      acc += value;
    }),
  );

  source.value(mainGuest);
  source.value(secondGuest);

  give(2, source);

  expect(acc).toBe(4);
});
