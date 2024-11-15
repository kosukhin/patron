import { GuestDisposableType } from "../Guest/GuestDisposable";
import { give, GuestObjectType, GuestType, GiveOptions } from "../Guest/Guest";

const poolSets = new Map<PoolType, Set<GuestObjectType>>();

// remove patron from all pools
export const removePatronFromPools = (patron: GuestObjectType) => {
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};

// check patron existed in any pool
export const isPatronInPools = (patron: GuestObjectType) => {
  let inPool = false;
  poolSets.forEach((pool) => {
    if (!inPool) {
      inPool = pool.has(patron);
    }
  });
  return inPool;
};

export interface PoolType<T = unknown> extends GuestObjectType<T> {
  add(guest: GuestObjectType<T>): this;
  distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
  remove(patron: GuestObjectType<T>): this;
  size(): number;
}

export class PatronPool<T> implements PoolType<T> {
  private patrons: Set<GuestObjectType<T>>;

  public give: (value: T, options?: GiveOptions) => this;

  public constructor(private initiator: unknown) {
    this.patrons = new Set<GuestObjectType<T>>();
    poolSets.set(this, this.patrons);
    let lastMicrotask: (() => void) | null = null;
    const doReceive = (value: T, options?: GiveOptions) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target, options);
      });
    };
    this.give = (value: T, options?: GiveOptions) => {
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

  public size(): number {
    return this.patrons.size;
  }

  public add(shouldBePatron: GuestType<T>) {
    if (!shouldBePatron) {
      throw new Error("PatronPool add method received nothing!");
    }
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
    options?: GiveOptions,
  ) {
    const isDisposed = this.guestDisposed(value, guest);

    if (!isDisposed) {
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

  private guestDisposed(value: T, guest: GuestType<T>) {
    if ((guest as GuestDisposableType).disposed?.(value)) {
      this.remove(guest as GuestObjectType);
      return true;
    }

    return false;
  }
}
