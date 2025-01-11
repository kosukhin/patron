import { GuestType } from "./Guest";

export type GuestAwareExecutorType<T> = (guest: GuestType<T>) => unknown;

export interface GuestAwareObjectType<T> {
  value: GuestAwareExecutorType<T>
}

export type GuestAwareType<T = any> = GuestAwareExecutorType<T> | GuestAwareObjectType<T>

export function value<T>(guestAware: GuestAwareType<T>, guest: GuestType<T>) {
  if (typeof guestAware === 'function') {
    return guestAware(guest);
  } else {
    return guestAware.value(guest);
  }
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware
 */
export class GuestAware<T = any> implements GuestAwareObjectType<T> {
  public constructor(private guestAware: GuestAwareType<T>) { }

  public value(guest: GuestType<T>): GuestType<T> {
    value(this.guestAware, guest);
    return guest;
  }
}
