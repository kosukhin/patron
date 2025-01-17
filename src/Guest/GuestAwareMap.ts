import { FactoryType } from "../Factory/Factory";
import { give } from "./Guest";
import { GuestAwareObjectType, GuestAwareType, value } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestAwareAll } from "./GuestAwareAll";
import { GuestType } from "./Guest";
import { GuestAware } from "./GuestAware";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-map
 */
export class GuestAwareMap<T, TG> implements GuestAwareObjectType<TG[]> {
  public constructor(
    private baseSource: GuestAwareType<T[]>,
    private targetSourceFactory: FactoryType<GuestAwareType<TG>>
  ) { }

  public value(guest: GuestType<TG[]>) {
    const all = new GuestAwareAll();
    value(
      this.baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        theValue.forEach((val, index) => {
          const targetSource = this.targetSourceFactory.create(
            new GuestAware((innerGuest) => {
              give(val, innerGuest);
            })
          )
          value(targetSource, all.guestKey(index.toString()));
        });
      })
    )
    all.valueArray(<GuestType>guest);
    return this;
  }
}
