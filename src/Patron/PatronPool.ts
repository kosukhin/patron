import {
  give,
  GuestObjectType,
  GuestType,
  ReceiveOptions,
} from "../Guest/Guest";

const poolSets = new Map<PoolType, Set<GuestObjectType>>();

/**
 * Удалить патрон из всех пулов
 */
export const removePatronFromPools = (patron: GuestObjectType) => {
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};

export interface PoolType<T = unknown> extends GuestObjectType<T> {
  add(guest: GuestObjectType<T>): this;
  distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
  remove(patron: GuestObjectType<T>): this;
}

export class PatronPool<T> implements PoolType<T> {
  private patrons = new Set<GuestObjectType<T>>();

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
      typeof shouldBePatron !== "function" &&
      shouldBePatron.introduction &&
      shouldBePatron.introduction() === "patron"
    ) {
      this.patrons.add(shouldBePatron);
    }
    return this;
  }

  public remove(patron: GuestObjectType<T>) {
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
    give(value, guest, {
      ...options,
      data: {
        ...((options?.data as Record<string, unknown>) ?? {}),
        initiator: this.initiator,
        pool: this,
      },
    });
  }
}
