import { SourceObjectType } from "./Source";
import { SourceWithPool } from "./SourceWithPool";
import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { GuestObject } from "../Guest/GuestObject";
import { GuestPool } from "../Guest/GuestPool";

export interface SourceAllType<T = any> extends SourceObjectType<T> {
  valueArray(guest: GuestObjectType<T>): this;
  guestKey<R>(key: string): GuestObjectType<R>;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/source-all
 */
export class SourceAll<T> implements SourceAllType<T> {
  private theAll: SourceWithPool<Record<string, unknown>>;

  private keysKnown: Set<string>;

  private keysFilled = new Set();

  private filledAllPool = new GuestPool(this);

  public constructor(initialKnownKeys: string[] = []) {
    this.theAll = new SourceWithPool<Record<string, unknown>>({});
    this.keysKnown = new Set(initialKnownKeys);
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
  }

  private isAllFilled() {
    return (
      this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size
    );
  }
}
