import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { SourceObjectType } from "./Source";
import { PatronPool } from "../Patron/PatronPool";
import { isPatron } from "../Patron/Patron";

export interface PoolAwareType<T = any> {
  pool(): PatronPool<T>;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/source-with-pool
 */
export type SourceWithPoolType<T = any> = SourceObjectType<T> &
  GuestObjectType<T> &
  PoolAwareType<T>;

export class SourceWithPool<T> implements SourceWithPoolType<T> {
  private thePool = new PatronPool(this);
  private theEmptyPool = new PatronPool(this);
  private isEmpty: boolean;

  public constructor(private sourceDocument?: T) {
    this.isEmpty = sourceDocument === undefined;
  }

  public pool() {
    return this.thePool;
  }

  public give(value: T): this {
    this.isEmpty = false;
    this.sourceDocument = value;
    this.thePool.give(this.sourceDocument);
    this.theEmptyPool.give(this.sourceDocument);
    return this;
  }

  public value(guest: GuestType<T>): this {
    if (this.isEmpty) {
      if (isPatron(guest)) {
        this.theEmptyPool.add(guest);
      }
      return this;
    }

    if (typeof guest === "function") {
      this.thePool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.thePool.distribute(this.sourceDocument, guest);
    }

    return this;
  }

  public filled() {
    return !this.isEmpty;
  }
}
