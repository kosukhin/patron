import {
  GuestDisposableType,
  MaybeDisposableType,
} from "./GuestDisposable";
import { GiveOptions, Guest, GuestType } from "./Guest";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-object
 */
export class GuestObject<T> implements GuestDisposableType<T> {
  public constructor(private baseGuest: GuestType<T>) { }

  public give(value: T, options?: GiveOptions): this {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.give(value, options);
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
