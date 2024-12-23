import { PoolType } from "./PatronPool";
import { give, GuestType, GiveOptions } from "../Guest/Guest";
import {
  GuestDisposableType,
  MaybeDisposableType,
} from "../Guest/GuestDisposable";

type PoolAware = {
  pool?: PoolType;
};

/**
 * @url https://kosukhin.github.io/patron.site/#/patron/patron-once
 */
export class PatronOnce<T> implements GuestDisposableType<T> {
  private received = false;

  public constructor(private baseGuest: GuestType<T>) { }

  public introduction() {
    return "patron" as const;
  }

  public give(value: T, options?: GiveOptions): this {
    if (!this.received) {
      give(value, this.baseGuest, options);
    }
    const data = options?.data as PoolAware;
    if (data?.pool) {
      data.pool.remove(this);
    }
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.baseGuest as MaybeDisposableType;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}
