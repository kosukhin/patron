import { give, GuestObjectType, GuestType, GiveOptions } from "./Guest";

export class GuestCast<T> implements GuestObjectType<T> {
  public constructor(
    private sourceGuest: GuestType<unknown>,
    private targetGuest: GuestType<T>,
  ) {}

  public introduction() {
    if (typeof this.sourceGuest === "function") {
      return "guest";
    }
    if (!this.sourceGuest.introduction) {
      return "guest";
    }
    return this.sourceGuest.introduction();
  }

  public give(value: T, options?: GiveOptions): this {
    give(value, this.targetGuest, options);
    return this;
  }
}
