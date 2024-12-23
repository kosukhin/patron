import { FactoryType } from "../Factory/Factory";
import { give } from "./Guest";
import { GuestAwareType } from "./GuestAware";
import { GuestCast } from "./GuestCast";
import { GuestChain } from "./GuestChain";
import { GuestType } from "./Guest";
import { SourceEmpty } from "../Source/SourceEmpty";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-sequence
 */
export class GuestAwareSequence<T, TG> implements GuestAwareType<TG[]> {
  public constructor(
    private baseSource: GuestAwareType<T[]>,
    private targetSourceFactory: FactoryType<GuestAwareType<TG>>
  ) { }

  public value(guest: GuestType<TG[]>) {
    const chain = new GuestChain<TG[]>();
    const sequenceSource = new SourceEmpty();
    const targetSource = this.targetSourceFactory.create(
      sequenceSource
    )

    this.baseSource.value(
      new GuestCast(guest, (value) => {
        let index = 0;

        const nextItemHandle = () => {
          if (value[index + 1] !== undefined) {
            index = index + 1;
            handle();
          } else {
            chain.resultArray(guest);
          }
        }

        function handle() {
          sequenceSource.give(value[index]);
          targetSource.value(chain.receiveKey('' + index));
          targetSource.value(nextItemHandle);
        }

        if (value[index] !== undefined) {
          handle();
        } else {
          give([], guest);
        }
      })
    );

    return this;
  }
}
