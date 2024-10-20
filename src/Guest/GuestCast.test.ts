import { expect, test } from "vitest";
import { SourceOfValue } from "../Source/SourceOfValue";
import { PatronOfGuest } from "../Patron/PatronOfGuest";
import { GuestCallback } from "./GuestCallback";
import { GuestCast } from "./GuestCast";

test("chain guest returns 2 values after result guest", () => {
  const source = new SourceOfValue(1);
  let acc = 0;
  const mainGuest = new PatronOfGuest(
    new GuestCallback((value: number) => {
      acc += value;
    }),
  );
  // Становится патроном тоже, тк наследует это сойство от mainGuest
  const secondGuest = new GuestCast(
    mainGuest,
    new GuestCallback((value: number) => {
      acc += value;
    }),
  );

  source.receiving(mainGuest);
  source.receiving(secondGuest);

  source.receive(2);

  setTimeout(() => {
    expect(acc).toBe(6);
  });
});
