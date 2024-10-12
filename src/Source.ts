import { GuestType } from "./GuestType";
import { PatronPool } from "./PatronPool";
import { SourceType } from "./SourceType";

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
