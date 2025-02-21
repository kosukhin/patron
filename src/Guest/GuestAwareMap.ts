import { PrivateType } from "../Private/Private";
import { give, GuestType } from "./Guest";
import {
  GuestAware,
  GuestAwareObjectType,
  GuestAwareType,
  isGuestAware,
  value,
} from "./GuestAware";
import { GuestAwareAll } from "./GuestAwareAll";
import { GuestCast } from "./GuestCast";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-map
 */
export class GuestAwareMap<T, TG> implements GuestAwareObjectType<TG[]> {
  public constructor(
    private baseSource: GuestAwareType<T[]>,
    private targetSource: PrivateType<GuestAwareType<TG>>,
  ) {
    if (!baseSource) {
      throw new Error("GuestAwareMap didnt receive baseSource argument");
    }
    if (!targetSource) {
      throw new Error("GuestAwareMap didnt receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    const all = new GuestAwareAll();
    value(
      this.baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        theValue.forEach((val, index) => {
          const valueSource = isGuestAware(val)
            ? val
            : new GuestAware((innerGuest) => {
                give(val, innerGuest);
              });
          const targetSource = this.targetSource.get(valueSource);
          value(targetSource, all.guestKey(index.toString()));
        });
      }),
    );
    all.valueArray(<GuestType>guest);
    return this;
  }
}
