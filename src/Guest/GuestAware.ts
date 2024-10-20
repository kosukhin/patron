import { GuestType } from "./GuestCallback";

export interface GuestAwareType<T = unknown> {
  receiving(guest: GuestType<T>): unknown;
}

export class GuestAware<T = unknown> implements GuestAwareType<T> {
  public constructor(private guestReceiver: (guest: GuestType<T>) => void) {}

  public receiving(guest: GuestType<T>): GuestType<T> {
    this.guestReceiver(guest);
    return guest;
  }
}
