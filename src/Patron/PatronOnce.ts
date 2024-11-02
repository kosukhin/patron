import { PoolType } from "./PatronPool";
import { give, GuestObjectType, GuestType, GiveOptions } from "../Guest/Guest";

type PoolAware = {
  pool?: PoolType;
};

export class PatronOnce<T> implements GuestObjectType<T> {
  private received = false;

  public constructor(private baseGuest: GuestType<T>) {}

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
}
