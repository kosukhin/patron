import { give, GuestType } from "../Guest/Guest";
import { SourceType, value } from "./Source";
import { PatronPool } from "../Patron/PatronPool";
import { SourceWithPoolType } from "./SourceWithPool";

/**
 * @url https://kosukhin.github.io/patron.site/#/source-dynamic
 */
export class SourceDynamic<T = unknown> implements SourceWithPoolType<T> {
  public constructor(
    private baseGuest: GuestType<T>,
    private baseSource: SourceType<T>,
  ) {
    if (baseGuest === undefined) {
      throw new Error("SourceDynamic didnt receive baseGuest argument");
    }
    if (baseSource === undefined) {
      throw new Error("SourceDynamic didnt receive baseSource argument");
    }
  }

  public value(guest: GuestType<T>) {
    value(this.baseSource, guest);
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
