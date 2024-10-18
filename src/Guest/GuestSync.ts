import { GuestType } from "./GuestCallback";

export interface GuestValueType<T = unknown> extends GuestType<T> {
  value(): T;
}

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
