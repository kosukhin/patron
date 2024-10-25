import { GuestObjectType, ReceiveOptions } from "./Guest";

export class GuestInTheMiddle<T> implements GuestObjectType<T> {
  public constructor(
    private baseGuest: GuestObjectType<unknown>,
    private middleFn: (value: T, options?: ReceiveOptions) => void,
  ) {}

  introduction() {
    if (!this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }

  receive(value: T, options?: ReceiveOptions): this {
    this.middleFn(value, options);
    return this;
  }
}
