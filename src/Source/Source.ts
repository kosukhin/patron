import { GuestAwareType } from "../Guest/GuestAware";
import { Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { PatronPool } from "../Patron/PatronPool";

export type SourceType<T = unknown> = GuestAwareType<T> & GuestObjectType<T>;

export class Source<T> implements SourceType<T> {
  private pool = new PatronPool(this);

  public constructor(private sourceDocument: T) {}

  public receive(value: T): this {
    this.sourceDocument = value;
    this.pool.receive(this.sourceDocument);
    return this;
  }

  public receiving(guest: GuestType<T>): this {
    if (typeof guest === "function") {
      this.pool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.pool.distribute(this.sourceDocument, guest);
    }
    return this;
  }
}