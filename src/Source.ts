import { GuestAwareType } from "src/GuestAware";
import { GuestType } from "./Guest";
import { PatronPool } from "./PatronPool";

export type SourceType<T = unknown> = GuestAwareType<T> & GuestType<T>;

export class Source<T> implements SourceType<T> {
  private pool = new PatronPool(this);

  public constructor(private sourceDocument: T) {}

  public receive(value: T): this {
    this.sourceDocument = value;
    this.pool.receive(this.sourceDocument);
    return this;
  }

  public receiving(guest: GuestType<T>): this {
    this.pool.distribute(this.sourceDocument, guest);
    return this;
  }
}
