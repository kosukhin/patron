import { GuestType } from "./Guest";

export type GuestAwareExecutorType<T> = (guest: GuestType<T>) => unknown;

export interface GuestAwareObjectType<T> {
  value: GuestAwareExecutorType<T>;
}

export type GuestAwareType<T = any> =
  | GuestAwareExecutorType<T>
  | GuestAwareObjectType<T>;

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/give
 */
export function value<T>(guestAware: GuestAwareType<T>, guest: GuestType<T>) {
  if (!guestAware) {
    throw new Error("value didnt receive guestAware argument");
  }
  if (!guest) {
    throw new Error("value didnt receive guest argument");
  }
  if (typeof guestAware === "function") {
    return guestAware(guest);
  } else {
    return guestAware.value(guest);
  }
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/is-guest-aware
 */
export function isGuestAware(
  mbGuestAware: any,
): mbGuestAware is GuestAwareType {
  if (!mbGuestAware) {
    throw new Error("isGuestAware didnt receive mbGuestAware argument");
  }
  return (
    typeof mbGuestAware === "function" ||
    typeof mbGuestAware?.value === "function"
  );
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware
 */
export class GuestAware<T = any> implements GuestAwareObjectType<T> {
  public constructor(private guestAware: GuestAwareType<T>) {
    if (!guestAware) {
      throw new Error("GuestAware constructor didnt receive executor function");
    }
  }

  public value(guest: GuestType<T>): GuestType<T> {
    value(this.guestAware, guest);
    return guest;
  }
}
