import { FactoryType } from "../Factory/Factory";
import { give } from "./Guest";
import { GuestAwareObjectType, GuestAwareType, value } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestAwareAll } from "./GuestAwareAll";
import { GuestType } from "./Guest";
import { SourceEmpty } from "../Source/SourceEmpty";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-sequence
 */
export class GuestAwareSequence<T, TG> implements GuestAwareObjectType<TG[]> {
  public constructor(
    private baseSource: GuestAwareType<T[]>,
    private targetSourceFactory: FactoryType<GuestAwareType<TG>>
  ) { }

  public value(guest: GuestType<TG[]>) {
    const all = new GuestAwareAll<TG[]>();
    const sequenceSource = new SourceEmpty();
    const targetSource = this.targetSourceFactory.create(
      sequenceSource
    )

    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        let index = 0;

        const nextItemHandle = () => {
          if (theValue[index + 1] !== undefined) {
            index = index + 1;
            handle();
          } else {
            all.valueArray(guest);
          }
        }

        function handle() {
          sequenceSource.give(theValue[index]);
          value(targetSource, all.guestKey(index.toString()));
          value(targetSource, nextItemHandle);
        }

        if (theValue[index] !== undefined) {
          handle();
        } else {
          give([], guest);
        }
      })
    );
    return this;
  }
}
