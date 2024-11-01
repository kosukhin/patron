import { give, GuestType } from "./../Guest/Guest";
import { GuestMiddle } from "./../Guest/GuestMiddle";
import { Source, SourceType } from "./Source";

export class SourceEmpty<T> implements SourceType<T> {
  private baseSource = new Source<T | null>(null);

  public receiving(guest: GuestType<T>) {
    this.baseSource.receiving(
      new GuestMiddle(guest as GuestType, (value) => {
        if (value !== null) {
          give(value, guest);
        }
      }),
    );
    return this;
  }

  public receive(value: T): this {
    this.baseSource.receive(value);
    return this;
  }
}
