import { FactoryType } from "../Factory/Factory";
import { give } from "./Guest";
import { GuestAwareObjectType, GuestAwareType, value } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestChain } from "./GuestChain";
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
    const chain = new GuestChain();
    value(
      this.baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        theValue.forEach((val, index) => {
          const targetSource = this.targetSourceFactory.create(
            new GuestAware((innerGuest) => {
              give(val, innerGuest);
            })
          )
          value(targetSource, chain.receiveKey('' + index));
        });
      })
    )
    chain.resultArray(<GuestType>guest);
    return this;
  }
}
