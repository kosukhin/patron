import { give, GuestObjectType, GuestType, ReceiveOptions } from "./Guest";

// TODO GuestMiddle - можно убрать т.к теперь этот класс делает то же самое и даже больше
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
