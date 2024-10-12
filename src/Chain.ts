import { Cache } from "./Cache";
import { Guest } from "./Guest";
import { GuestPool } from "./GuestPool";
import { ChainType } from "./ChainType";
import { GuestInTheMiddle } from "./GuestInTheMiddle";
import { GuestType } from "./GuestType";

export class Chain<T> implements ChainType<T> {
  private theChain: Cache<Record<string, unknown>>;

  private keysKnown = new Set();

  private keysFilled = new Set();

  private filledChainPool = new GuestPool(this);

  public constructor() {
    this.theChain = new Cache<Record<string, unknown>>(this, {});
  }

  public resultArray(guest: GuestType<T>) {
    this.filledChainPool.add(
      new GuestInTheMiddle(guest, (value: Record<string, unknown>) =>
        Object.values(value),
      ),
    );
    if (this.isChainFilled()) {
      this.theChain.receiving(
        new Guest((chain) => {
          this.filledChainPool.receive(Object.values(chain));
        }),
      );
    }

    return this;
  }

  public result(guest: GuestType<T>) {
    if (this.isChainFilled()) {
      this.filledChainPool.add(guest);
      this.theChain.receiving(
        new Guest((chain) => {
          this.filledChainPool.receive(chain);
        }),
      );
    } else {
      this.filledChainPool.add(guest);
    }
    return this;
  }

  public receiveKey<R>(key: string): GuestType<R> {
    this.keysKnown.add(key);
    return new Guest((value) => {
      // Обернул в очередь чтобы можно было синхронно наполнить очередь известных ключей
      queueMicrotask(() => {
        this.theChain.receiving(
          new Guest((chain) => {
            this.keysFilled.add(key);
            const lastChain = {
              ...chain,
              [key]: value,
            };
            this.theChain.receive(lastChain);
            if (this.isChainFilled()) {
              this.filledChainPool.receive(lastChain);
            }
          }),
        );
      });
    });
  }

  private isChainFilled() {
    return (
      this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size
    );
  }
}
