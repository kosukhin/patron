import { PatronPool, PoolType } from "../Patron/PatronPool";
import { give, GuestObjectType, GuestType } from "./Guest";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-pool
 */
export class GuestPool<T> implements GuestObjectType<T>, PoolType<T> {
  private guests = new Set<GuestType<T>>();

  private patronPool: PatronPool<T>;

  public constructor(initiator: unknown) {
    this.patronPool = new PatronPool(initiator);
  }

  public give(value: T): this {
    this.deliverToGuests(value);
    this.patronPool.give(value);
    return this;
  }

  public add(guest: GuestType<T>): this {
    if (
      typeof guest === "function" ||
      !guest.introduction ||
      guest.introduction() === "guest"
    ) {
      this.guests.add(guest);
    }
    this.patronPool.add(guest);
    return this;
  }

  public remove(patron: GuestObjectType<T>): this {
    this.guests.delete(patron);
    this.patronPool.remove(patron);
    return this;
  }

  public distribute(receiving: T, possiblePatron: GuestObjectType<T>): this {
    this.add(possiblePatron);
    this.give(receiving);
    return this;
  }

  public size() {
    return this.patronPool.size() + this.guests.size;
  }

  private deliverToGuests(value: T) {
    this.guests.forEach((target) => {
      give(value, target);
    });
    this.guests.clear();
  }
}
