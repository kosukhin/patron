import { GuestObjectType } from "./Guest";

export interface GuestValueType<T = unknown> extends GuestObjectType<T> {
  value(): T;
}

export class GuestSync<T> implements GuestValueType<T> {
  public constructor(private theValue: T) {}

  public give(value: T): this {
    this.theValue = value;
    return this;
  }

  public value() {
    return this.theValue;
  }
}
