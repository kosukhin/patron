import { GuestAwareType } from "../Guest/GuestAware";
import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { PatronPool } from "../Patron/PatronPool";

export interface PoolAware<T = any> {
  pool(): PatronPool<T>;
}

export type SourceType<T = any> = GuestAwareType<T> &
  GuestObjectType<T> &
  PoolAware<T>;

export class Source<T> implements SourceType<T> {
  private thePool = new PatronPool(this);

  public constructor(private sourceDocument: T) { }

  public pool() {
    return this.thePool;
  }

  public give(value: T): this {
    this.sourceDocument = value;
    this.thePool.give(this.sourceDocument);
    return this;
  }

  public value(guest: GuestType<T>): this {
    if (typeof guest === "function") {
      this.thePool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.thePool.distribute(this.sourceDocument, guest);
    }
    return this;
  }
}
