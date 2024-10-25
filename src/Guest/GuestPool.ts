import { PatronPool } from "../Patron/PatronPool";
import { PoolType } from "../Patron/PatronPool";
import { give, GuestObjectType, GuestType, ReceiveOptions } from "./Guest";

export class GuestPool<T> implements GuestObjectType<T>, PoolType<T> {
  private guests = new Set<GuestType<T>>();

  private patronPool: PatronPool<T>;

  public constructor(initiator: unknown) {
    this.patronPool = new PatronPool(initiator);
  }

  public receive(value: T, options?: ReceiveOptions): this {
    this.deliverToGuests(value, options);
    this.patronPool.receive(value, options);
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
    this.receive(receiving);
    return this;
  }

  private deliverToGuests(value: T, options?: ReceiveOptions) {
    this.guests.forEach((target) => {
      give(value, target, options);
    });
    this.guests.clear();
  }
}
