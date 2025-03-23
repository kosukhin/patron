import { give, GuestType } from "../Guest/Guest";
import { GuestDisposableType } from "../Guest/GuestDisposable";

/**
 * @url https://kosukhin.github.io/patron.site/#/patron
 */
export class Patron<T> implements GuestDisposableType<T> {
  public constructor(private willBePatron: GuestType<T>) {
    if (willBePatron === undefined) {
      throw new Error("Patron didnt receive willBePatron argument");
    }
  }

  public introduction() {
    return "patron" as const;
  }

  public give(value: T): this {
    give(value, this.willBePatron);
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.willBePatron as GuestDisposableType;
    return maybeDisposable?.disposed?.(value) || false;
  }
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/is-patron
 */
export const isPatron = (guest: GuestType): guest is Patron<unknown> =>
  typeof guest === "object" &&
  guest !== null &&
  guest?.introduction?.() === "patron";
