import { GuestType, ReceiveOptions } from './GuestType';

export class GuestCast<T> implements GuestType<T> {
  public constructor(
    private sourceGuest: GuestType<unknown>,
    private targetGuest: GuestType<T>,
  ) {
  }

  introduction() {
    if (!this.sourceGuest.introduction) {
      return 'guest';
    }
    return this.sourceGuest.introduction();
  }

  receive(value: T, options?: ReceiveOptions): this {
    this.targetGuest.receive(value, options);
    return this;
  }
}
