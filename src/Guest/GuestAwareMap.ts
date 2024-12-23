import { FactoryType } from "../Factory/Factory";
import { give } from "./Guest";
import { GuestAwareType } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestChain } from "./GuestChain";
import { GuestType } from "./Guest";
import { GuestAware } from "./GuestAware";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-map
 */
export class GuestAwareMap<T, TG> implements GuestAwareType<TG[]> {
  public constructor(
    private baseSource: GuestAwareType<T[]>,
    private targetSourceFactory: FactoryType<GuestAwareType<TG>>
  ) { }

  value(guest: GuestType<TG[]>) {
    const chain = new GuestChain();
    this.baseSource.value(
      new GuestCast(<GuestType>guest, (value) => {
        value.forEach((val, index) => {
          const targetSource = this.targetSourceFactory.create(
            new GuestAware((innerGuest) => {
              give(val, innerGuest);
            })
          )
          targetSource.value(chain.receiveKey('' + index));
        });
      })
    );
    chain.resultArray(<GuestType>guest);
    return this;
  }
}
