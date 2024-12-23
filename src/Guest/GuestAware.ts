import { GuestType } from "./Guest";

export interface GuestAwareType<T = any> {
  value(guest: GuestType<T>): unknown;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware
 */
export class GuestAware<T = any> implements GuestAwareType<T> {
  public constructor(private guestReceiver: (guest: GuestType<T>) => void) { }

  public value(guest: GuestType<T>): GuestType<T> {
    this.guestReceiver(guest);
    return guest;
  }
}
