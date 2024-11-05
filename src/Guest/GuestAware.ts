import { GuestType } from "./Guest";

export interface GuestAwareType<T = unknown> {
  value(guest: GuestType<T>): unknown;
}

export class GuestAware<T = unknown> implements GuestAwareType<T> {
  public constructor(private guestReceiver: (guest: GuestType<T>) => void) {}

  public value(guest: GuestType<T>): GuestType<T> {
    this.guestReceiver(guest);
    return guest;
  }
}
