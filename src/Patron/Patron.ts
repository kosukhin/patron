import { give, GuestObjectType, GuestType, GiveOptions } from "../Guest/Guest";

export class Patron<T> implements GuestObjectType<T> {
  public constructor(private willBePatron: GuestType<T>) {}

  public introduction() {
    return "patron" as const;
  }

  public give(value: T, options?: GiveOptions): this {
    give(value, this.willBePatron, options);
    return this;
  }
}
