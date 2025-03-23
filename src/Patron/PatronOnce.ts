import { give, GuestType } from "../Guest/Guest";
import {
  GuestDisposableType,
  MaybeDisposableType,
} from "../Guest/GuestDisposable";

/**
 * @url https://kosukhin.github.io/patron.site/#/patron/patron-once
 */
export class PatronOnce<T> implements GuestDisposableType<T> {
  private received = false;

  public constructor(private baseGuest: GuestType<T>) {
    if (baseGuest === undefined) {
      throw new Error("PatronOnce didnt receive baseGuest argument");
    }
  }

  public introduction() {
    return "patron" as const;
  }

  public give(value: T): this {
    if (!this.received) {
      this.received = true;
      give(value, this.baseGuest);
    }
    return this;
  }

  public disposed(value: T | null): boolean {
    if (this.received) {
      return true;
    }
    const maybeDisposable = this.baseGuest as MaybeDisposableType;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}
