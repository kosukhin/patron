import { GuestDisposableType } from "../Guest/GuestDisposable";
import { give, GiveOptions, GuestType } from "../Guest/Guest";

/**
 * @url https://kosukhin.github.io/patron.site/#/patron
 */
export class Patron<T> implements GuestDisposableType<T> {
  public constructor(private willBePatron: GuestType<T>) {
    if (!willBePatron) {
      throw new Error("Patron didnt receive willBePatron argument");
    }
  }

  public introduction() {
    return "patron" as const;
  }

  public give(value: T, options?: GiveOptions): this {
    give(value, this.willBePatron, options);
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.willBePatron as GuestDisposableType;
    return maybeDisposable?.disposed?.(value) || false;
  }
}
