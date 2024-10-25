import { give, GuestObjectType, GuestType, ReceiveOptions } from "./Guest";

export class GuestCast<T> implements GuestObjectType<T> {
  public constructor(
    private sourceGuest: GuestType<unknown>,
    private targetGuest: GuestType<T>,
  ) {}

  introduction() {
    if (typeof this.sourceGuest === "function") {
      return "guest";
    }

    if (!this.sourceGuest.introduction) {
      return "guest";
    }
    return this.sourceGuest.introduction();
  }

  receive(value: T, options?: ReceiveOptions): this {
    give(value, this.targetGuest, options);
    return this;
  }
}
