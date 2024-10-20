import { PoolType } from "./PatronPool";
import { GuestType, ReceiveOptions } from "../Guest/GuestCallback";

type PoolAware = {
  pool?: PoolType;
};

export class PatronOnce<T> implements GuestType<T> {
  private received = false;

  public constructor(private baseGuest: GuestType<T>) {}

  public introduction() {
    return "patron" as const;
  }

  public receive(value: T, options?: ReceiveOptions): this {
    if (!this.received) {
      this.baseGuest.receive(value, options);
    }

    const data = options?.data as PoolAware;

    if (data?.pool) {
      data.pool.remove(this);
    }

    return this;
  }
}
