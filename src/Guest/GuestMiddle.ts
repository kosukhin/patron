import { GuestObjectType, GuestType, GiveOptions } from "./Guest";

export class GuestMiddle<T> implements GuestObjectType<T> {
  public constructor(
    private baseGuest: GuestType<unknown>,
    private middleFn: (value: T, options?: GiveOptions) => void,
  ) {}

  public introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }

  public give(value: T, options?: GiveOptions): this {
    this.middleFn(value, options);
    return this;
  }
}
