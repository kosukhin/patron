import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestAwareObjectType } from "../Guest/GuestAware";
import { PatronPool } from "../Patron/PatronPool";

export interface PoolAware<T = any> {
  pool(): PatronPool<T>;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/source
 */
export type SourceType<T = any> = GuestAwareObjectType<T> &
  GuestObjectType<T> &
  PoolAware<T>;

export class Source<T> implements SourceType<T> {
  private thePool = new PatronPool(this);

  public constructor(private sourceDocument: T) {
    if (sourceDocument === undefined) {
      throw new Error("Source didnt receive sourceDocument argument");
    }
  }

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
