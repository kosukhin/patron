import { GuestCast } from "./GuestCast";
import { Source } from "../Source/Source";
import { Guest, GuestObjectType, GuestType } from "./Guest";
import { GuestObject } from "./GuestObject";
import { GuestPool } from "./GuestPool";

export interface ChainType<T = any> {
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

  public resultArray(guest: GuestType<T>) {
    const guestObject = new GuestObject(guest);
    this.filledChainPool.add(
      new GuestCast(guestObject, (value: Record<string, unknown>) => {
        guestObject.give(Object.values(value) as T);
      }),
    );
    if (this.isChainFilled()) {
      this.theChain.value(
        new Guest((chain: Record<string, unknown>) => {
          this.filledChainPool.give(Object.values(chain));
        }),
      );
    }
    return this;
  }

  public result(guest: GuestType<T>) {
    const guestObject = new GuestObject(guest);
    if (this.isChainFilled()) {
      this.filledChainPool.add(guestObject);
      this.theChain.value(
        new Guest((chain) => {
          this.filledChainPool.give(chain);
        }),
      );
    } else {
      this.filledChainPool.add(guestObject);
    }
    return this;
  }

  public receiveKey<R>(key: string): GuestObjectType<R> {
    this.keysKnown.add(key);
    return new Guest((value) => {
      // Обернул в очередь чтобы можно было синхронно наполнить очередь известных ключей
      queueMicrotask(() => {
        this.theChain.value(
          new Guest((chain: Record<string, unknown>) => {
            this.keysFilled.add(key);
            const lastChain = {
              ...chain,
              [key]: value,
            };
            this.theChain.give(lastChain);
            if (this.isChainFilled()) {
              this.filledChainPool.give(lastChain);
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
