import { GuestDisposableType } from "../Guest/GuestDisposable";
import { give, GiveOptions, GuestType } from "../Guest/Guest";

export class Patron<T> implements GuestDisposableType<T> {
  public constructor(private willBePatron: GuestType<T>) {}

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
