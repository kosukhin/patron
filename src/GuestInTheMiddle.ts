import {
  GuestType,
  ReceiveOptions,
} from './GuestType';

export class GuestInTheMiddle<T> implements GuestType<T> {
  public constructor(
    private baseGuest: GuestType<unknown>,
    private middleFn: (value: T, options?: ReceiveOptions) => void,
  ) {}

  introduction() {
    if (!this.baseGuest.introduction) {
      return 'guest';
    }
    return this.baseGuest.introduction();
  }

  receive(value: T, options?: ReceiveOptions): this {
    this.middleFn(value, options);
    return this;
  }
}
