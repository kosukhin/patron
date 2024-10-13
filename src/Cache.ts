import { PatronPool } from "./PatronPool";
import { GuestType, ReceiveOptions } from "./Guest";
import { GuestAwareType } from "./GuestAware";

export type CacheType<T = unknown> = GuestType<T> & GuestAwareType<T>;

export class Cache<T> implements CacheType<T> {
  private pool: PatronPool<T>;

  public constructor(
    initiator: unknown,
    private defaultValue: T | null = null,
    private theCache: T | null = null,
  ) {
    this.pool = new PatronPool<T>(initiator);
  }

  public receive(value: T, options?: ReceiveOptions): this {
    this.theCache = value;
    this.pool.receive(value, options);
    return this;
  }

  public receiving(guest: GuestType<T>): this {
    if (this.theCache !== null) {
      guest.receive(this.theCache);
    } else if (this.defaultValue !== null) {
      guest.receive(this.defaultValue);
    }
    this.pool.add(guest);
    return this;
  }
}
