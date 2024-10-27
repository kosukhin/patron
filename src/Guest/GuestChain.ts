import { Guest, GuestObjectType } from "./Guest";
import { GuestPool } from "./GuestPool";
import { GuestMiddle } from "./GuestMiddle";
import { Source } from "../Source/Source";

export interface ChainType<T = unknown> {
  result(guest: GuestObjectType<T>): this;
  resultArray(guest: GuestObjectType<T>): this;
  receiveKey<R>(key: string): GuestObjectType<R>;
}

export class GuestChain<T> implements ChainType<T> {
  private theChain: Source<Record<string, unknown>>;

  private keysKnown = new Set();

  private keysFilled = new Set();

  private filledChainPool = new GuestPool(this);

  public constructor() {
    this.theChain = new Source<Record<string, unknown>>({});
  }

  public resultArray(guest: GuestObjectType<T>) {
    this.filledChainPool.add(
      new GuestMiddle(guest, (value: Record<string, unknown>) =>
        Object.values(value),
      ),
    );
    if (this.isChainFilled()) {
      this.theChain.receiving(
        new Guest((chain: Record<string, unknown>) => {
          this.filledChainPool.receive(Object.values(chain));
        }),
      );
    }

    return this;
  }

  public result(guest: GuestObjectType<T>) {
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

  public receiveKey<R>(key: string): GuestObjectType<R> {
    this.keysKnown.add(key);
    return new Guest((value) => {
      // Обернул в очередь чтобы можно было синхронно наполнить очередь известных ключей
      queueMicrotask(() => {
        this.theChain.receiving(
          new Guest((chain: Record<string, unknown>) => {
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
