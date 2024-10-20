import { GuestType, ReceiveOptions } from "../Guest/GuestCallback";

const poolSets = new Map<PoolType, Set<GuestType>>();

/**
 * Удалить патрон из всех пулов
 */
export const removePatronFromPools = (patron: GuestType) => {
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};

export interface PoolType<T = unknown> extends GuestType<T> {
  add(guest: GuestType<T>): this;
  distribute(receiving: T, possiblePatron: GuestType<T>): this;
  remove(patron: GuestType<T>): this;
}

export class PatronPool<T> implements PoolType<T> {
  private patrons = new Set<GuestType<T>>();

  public receive: (value: T, options?: ReceiveOptions) => this;

  public constructor(private initiator: unknown) {
    poolSets.set(this, this.patrons);

    let lastMicrotask: (() => void) | null = null;
    const doReceive = (value: T, options?: ReceiveOptions) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target, options);
      });
    };
    this.receive = (value: T, options?: ReceiveOptions) => {
      const currentMicroTask = () => {
        if (currentMicroTask === lastMicrotask) {
          doReceive(value, options);
        }
      };
      lastMicrotask = currentMicroTask;
      queueMicrotask(currentMicroTask);
      return this;
    };
  }

  public add(shouldBePatron: GuestType<T>) {
    if (
      shouldBePatron.introduction &&
      shouldBePatron.introduction() === "patron"
    ) {
      this.patrons.add(shouldBePatron);
    }
    return this;
  }

  public remove(patron: GuestType<T>) {
    this.patrons.delete(patron);
    return this;
  }

  public distribute(receiving: T, possiblePatron: GuestType<T>): this {
    this.add(possiblePatron);
    this.sendValueToGuest(receiving, possiblePatron, {});
    return this;
  }

  private sendValueToGuest(
    value: T,
    guest: GuestType<T>,
    options?: ReceiveOptions,
  ) {
    guest.receive(value, {
      ...options,
      data: {
        ...((options?.data as Record<string, unknown>) ?? {}),
        initiator: this.initiator,
        pool: this,
      },
    });
  }
}
