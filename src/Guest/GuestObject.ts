import { Guest, GuestType } from "./Guest";
import { GuestDisposableType, MaybeDisposableType } from "./GuestDisposable";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-object
 */
export class GuestObject<T> implements GuestDisposableType<T> {
  public constructor(private baseGuest: GuestType<T>) {
    if (baseGuest === undefined) {
      throw new Error("GuestObject didnt receive baseGuest argument");
    }
  }

  public give(value: T): this {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.give(value);
    return this;
  }

  public introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.baseGuest as MaybeDisposableType;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}
