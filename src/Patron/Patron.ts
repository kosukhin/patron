import {
  give,
  GuestObjectType,
  GuestType,
  ReceiveOptions,
} from "../Guest/Guest";

/**
 * Патрон - это постоянный посетитель
 */
export class Patron<T> implements GuestObjectType<T> {
  public constructor(private willBePatron: GuestType<T>) {}

  public introduction() {
    return "patron" as const;
  }

  public receive(value: T, options?: ReceiveOptions): this {
    give(value, this.willBePatron, options);
    return this;
  }
}
