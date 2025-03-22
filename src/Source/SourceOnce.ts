import { PatronPool } from "../Patron/PatronPool";
import { GuestType } from "../Guest/Guest";
import { value } from "../Guest/GuestAware";
import { SourceType } from "../Source/Source";
import { SourceEmpty } from "../Source/SourceEmpty";

/**
 * @url https://kosukhin.github.io/patron.site/#/source/source-once
 */
export class SourceOnce<T> implements SourceType<T> {
  private source = new SourceEmpty<T>();
  private isFilled = false;

  public constructor(initialValue?: T) {
    if (initialValue !== undefined) {
      this.isFilled = true;
      this.source.give(initialValue);
    }
  }

  public value(guest: GuestType<T>) {
    value(this.source, guest);
    return this;
  }

  public give(value: T): this {
    if (!this.isFilled) {
      this.isFilled = true;
      this.source.give(value);
    }
    return this;
  }

  public pool(): PatronPool<T> {
    return this.source.pool();
  }
}
