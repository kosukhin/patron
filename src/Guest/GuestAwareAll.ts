import { GuestAwareObjectType } from "./GuestAware";
import { Source } from "../Source/Source";
import { Guest, GuestObjectType, GuestType } from "./Guest";
import { GuestCast } from "./GuestCast";
import { GuestObject } from "./GuestObject";
import { GuestPool } from "./GuestPool";

export interface GuestAwareAllType<T = any> extends GuestAwareObjectType<T> {
  valueArray(guest: GuestObjectType<T>): this;
  guestKey<R>(key: string): GuestObjectType<R>;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-all
 */
export class GuestAwareAll<T> implements GuestAwareAllType<T> {
  private theAll: Source<Record<string, unknown>>;

  private keysKnown = new Set();

  private keysFilled = new Set();

  private filledAllPool = new GuestPool(this);

  public constructor() {
    this.theAll = new Source<Record<string, unknown>>({});
  }

  public valueArray(guest: GuestType<T>) {
    const guestObject = new GuestObject(guest);
    this.filledAllPool.add(
      new GuestCast(guestObject, (value: Record<string, unknown>) => {
        guestObject.give(Object.values(value) as T);
      }),
    );
    if (this.isAllFilled()) {
      this.theAll.value(
        new Guest((all: Record<string, unknown>) => {
          this.filledAllPool.give(Object.values(all));
        }),
      );
    }
    return this;
  }

  public value(guest: GuestType<T>) {
    const guestObject = new GuestObject(guest);
    if (this.isAllFilled()) {
      this.filledAllPool.add(guestObject);
      this.theAll.value(
        new Guest((all) => {
          this.filledAllPool.give(all);
        }),
      );
    } else {
      this.filledAllPool.add(guestObject);
    }
    return this;
  }

  public guestKey<R>(key: string): GuestObjectType<R> {
    this.keysKnown.add(key);
    return new Guest((value) => {
      // Обернул в очередь чтобы можно было синхронно наполнить очередь известных ключей
      queueMicrotask(() => {
        this.theAll.value(
          new Guest((all: Record<string, unknown>) => {
            this.keysFilled.add(key);
            const lastAll = {
              ...all,
              [key]: value,
            };
            this.theAll.give(lastAll);
            if (this.isAllFilled()) {
              this.filledAllPool.give(lastAll);
            }
          }),
        );
      });
    });
  }

  private isAllFilled() {
    return (
      this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size
    );
  }
}
