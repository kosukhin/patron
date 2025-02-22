import { PatronOnce } from "../Patron/PatronOnce";
import { PrivateType } from "../Private/Private";
import { SourceEmpty } from "../Source/SourceEmpty";
import { give, GuestType } from "./Guest";
import {
  GuestAwareObjectType,
  GuestAwareType,
  isGuestAware,
  value,
} from "./GuestAware";
import { GuestAwareAll } from "./GuestAwareAll";
import { GuestCast } from "./GuestCast";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-sequence
 */
export class GuestAwareSequence<T, TG> implements GuestAwareObjectType<TG[]> {
  public constructor(
    private baseSource: GuestAwareType<T[]>,
    private targetSource: PrivateType<GuestAwareType<TG>>,
  ) {
    if (baseSource === undefined) {
      throw new Error("GuestAwareSequence didnt receive baseSource argument");
    }
    if (targetSource === undefined) {
      throw new Error("GuestAwareSequence didnt receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    const all = new GuestAwareAll<TG[]>();
    const sequenceSource = new SourceEmpty();
    const targetSource = this.targetSource.get(sequenceSource);

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
        };

        function handle() {
          sequenceSource.give(null);
          const nextValue = theValue[index];
          if (isGuestAware(nextValue)) {
            value(
              nextValue,
              new PatronOnce((theNextValue) => {
                sequenceSource.give(theNextValue);
                value(targetSource, all.guestKey(index.toString()));
                nextItemHandle();
              }),
            );
          } else {
            sequenceSource.give(nextValue);
            value(targetSource, all.guestKey(index.toString()));
            nextItemHandle();
          }
        }

        if (theValue[index] !== undefined) {
          handle();
        } else {
          give([], guest);
        }
      }),
    );
    return this;
  }
}
