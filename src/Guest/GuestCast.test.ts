import { expect, test } from "vitest";
import { SourceOfValue } from "../Source/SourceOfValue";
import { Patron } from "../Patron/Patron";
import { give, Guest } from "./Guest";
import { GuestCast } from "./GuestCast";

test("chain guest returns 2 values after result guest", () => {
  const source = new SourceOfValue(1);
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

  source.receiving(mainGuest);
  source.receiving(secondGuest);

  give(2, source);

  setTimeout(() => {
    expect(acc).toBe(6);
  });
});
