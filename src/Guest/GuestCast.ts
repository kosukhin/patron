import { give, GuestType } from "./Guest";
import { GuestDisposableType, MaybeDisposableType } from "./GuestDisposable";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-cast
 */
export class GuestCast<T> implements GuestDisposableType<T> {
  public constructor(
    private sourceGuest: GuestType<any>,
    private targetGuest: GuestType<T>,
  ) {
    if (sourceGuest === undefined) {
      throw new Error("GuestCast didnt receive sourceGuest argument");
    }
    if (targetGuest === undefined) {
      throw new Error("GuestCast didnt receive targetGuest argument");
    }
  }

  public introduction() {
    if (typeof this.sourceGuest === "function") {
      return "guest";
    }
    if (!this.sourceGuest.introduction) {
      return "guest";
    }
    return this.sourceGuest.introduction();
  }

  public give(value: T): this {
    give(value, this.targetGuest);
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.sourceGuest as MaybeDisposableType;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}
