import { GuestType } from "../Guest/Guest";
import { PatronPool } from "../Patron/PatronPool";
import { value } from "./Source";
import { SourceWithPool, SourceWithPoolType } from "./SourceWithPool";

/**
 * @url https://kosukhin.github.io/patron.site/#/source/source-once
 */
export class SourceOnce<T> implements SourceWithPoolType<T> {
  private source: SourceWithPool<T>;

  public constructor(initialValue?: T) {
    this.source = new SourceWithPool(initialValue);
  }

  public value(guest: GuestType<T>) {
    value(this.source, guest);
    return this;
  }

  public give(value: T): this {
    if (!this.source.filled()) {
      this.source.give(value);
    }
    return this;
  }

  public pool(): PatronPool<T> {
    return this.source.pool();
  }
}
