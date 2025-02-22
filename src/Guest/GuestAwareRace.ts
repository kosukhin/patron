import { give, GuestType } from "./Guest";
import { GuestAwareObjectType, GuestAwareType, value } from "./GuestAware";
import { GuestCast } from "./GuestCast";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-race
 */
export class GuestAwareRace<T> implements GuestAwareObjectType<T> {
  public constructor(private guestAwares: GuestAwareType<T>[]) {
    if (guestAwares === undefined) {
      throw new Error("GuestAwareRace didnt receive guestAwares argument");
    }
  }

  public value(guest: GuestType<T>): this {
    let connectedWithGuestAware: GuestAwareType | null = null;
    this.guestAwares.forEach((guestAware) => {
      value(
        guestAware,
        new GuestCast(<GuestType>guest, (value) => {
          if (
            !connectedWithGuestAware ||
            connectedWithGuestAware === guestAware
          ) {
            give(value as T, guest);
            connectedWithGuestAware = guestAware;
          }
        }),
      );
    });
    return this;
  }
}
