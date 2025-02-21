import { GuestObjectType } from "./Guest";

export interface GuestValueType<T = any> extends GuestObjectType<T> {
  value(): T;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-sync
 */
export class GuestSync<T> implements GuestValueType<T> {
  public constructor(private theValue: T) {
    if (theValue === undefined) {
      throw new Error("GuestSync didnt receive theValue argument");
    }
  }

  public give(value: T): this {
    this.theValue = value;
    return this;
  }

  public value() {
    return this.theValue;
  }
}
