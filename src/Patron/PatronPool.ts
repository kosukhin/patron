import { give, GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestDisposableType } from "../Guest/GuestDisposable";

const poolSets = new Map<PoolType, Set<GuestObjectType>>();

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/patron-pools
 */
export const patronPools = (patron: GuestObjectType) => {
  const pools: PoolType[] = [];
  poolSets.forEach((pool, poolInstance) => {
    if (pool.has(patron)) {
      pools.push(poolInstance);
    }
  });
  return pools;
};

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/remove-patron-from-pools
 */
export const removePatronFromPools = (patron: GuestObjectType) => {
  if (patron === undefined) {
    throw new Error("removePatronFromPools didnt receive patron argument");
  }
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/is-patron-in-pools
 */
export const isPatronInPools = (patron: GuestObjectType) => {
  if (patron === undefined) {
    throw new Error("isPatronInPools didnt receive patron argument");
  }
  let inPool = false;
  poolSets.forEach((pool) => {
    if (!inPool) {
      inPool = pool.has(patron);
    }
  });
  return inPool;
};

export interface PoolType<T = any> extends GuestObjectType<T> {
  add(guest: GuestObjectType<T>): this;
  distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
  remove(patron: GuestObjectType<T>): this;
  size(): number;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/patron/patron-pool
 */
export class PatronPool<T> implements PoolType<T> {
  private patrons: Set<GuestObjectType<T>>;

  public give: (value: T) => this;

  public constructor(private initiator: unknown) {
    this.patrons = new Set<GuestObjectType<T>>();
    poolSets.set(this, this.patrons);
    const doReceive = (value: T) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target);
      });
    };
    this.give = (value: T) => {
      doReceive(value);
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
    this.sendValueToGuest(receiving, possiblePatron);
    return this;
  }

  private sendValueToGuest(value: T, guest: GuestType<T>) {
    const isDisposed = this.guestDisposed(value, guest);

    if (!isDisposed) {
      give(value, guest);
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
