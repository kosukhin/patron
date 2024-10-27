import { GuestObjectType, GuestType, ReceiveOptions } from "./Guest";

export class GuestMiddle<T> implements GuestObjectType<T> {
  public constructor(
    private baseGuest: GuestType<unknown>,
    private middleFn: (value: T, options?: ReceiveOptions) => void,
  ) {}

  introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }

  receive(value: T, options?: ReceiveOptions): this {
    this.middleFn(value, options);
    return this;
  }
}
