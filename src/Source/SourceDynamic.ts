import { give, GuestType } from "../Guest/Guest";
import { GuestAwareType, value } from "../Guest/GuestAware";
import { PatronPool } from "../Patron/PatronPool";
import { SourceType } from "./Source";

/**
 * @url https://kosukhin.github.io/patron.site/#/source-dynamic
 */
export class SourceDynamic<T = unknown> implements SourceType<T> {
  public constructor(
    private baseGuest: GuestType<T>,
    private baseGuestAware: GuestAwareType<T>,
  ) {
    if (baseGuest === undefined) {
      throw new Error("SourceDynamic didnt receive baseGuest argument");
    }
    if (baseGuestAware === undefined) {
      throw new Error("SourceDynamic didnt receive baseGuestAware argument");
    }
  }

  public value(guest: GuestType<T>) {
    value(this.baseGuestAware, guest);
    return this;
  }

  public give(value: T) {
    give(value, this.baseGuest);
    return this;
  }

  public pool(): PatronPool<T> {
    throw Error("No pool in SourceDynamic");
  }
}
