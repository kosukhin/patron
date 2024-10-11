import { GuestValueType } from './GuestValueType';

export class GuestSync<T> implements GuestValueType<T> {
  public constructor(private theValue: T) {}

  public receive(value: T): this {
    this.theValue = value;
    return this;
  }

  public value() {
    return this.theValue;
  }
}
