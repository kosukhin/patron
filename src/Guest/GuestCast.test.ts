import { expect, test } from "vitest";
import { Source } from "../Source/Source";
import { Patron } from "../Patron/Patron";
import { give, Guest } from "./Guest";
import { GuestCast } from "./GuestCast";

test("GuestCast.test", () => {
  const source = new Source(1);
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

  setTimeout(() => {
    expect(acc).toBe(6);
  });
});
