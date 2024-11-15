import {
  GuestDisposableType,
  MaybeDisposableType,
} from "src/Guest/GuestDisposable";
import { give, GiveOptions, GuestType } from "./Guest";

export class GuestCast<T> implements GuestDisposableType<T> {
  public constructor(
    private sourceGuest: GuestType<unknown>,
    private targetGuest: GuestType<T>,
  ) {}

  public introduction() {
    if (typeof this.sourceGuest === "function") {
      return "guest";
    }
    if (!this.sourceGuest.introduction) {
      return "guest";
    }
    return this.sourceGuest.introduction();
  }

  public give(value: T, options?: GiveOptions): this {
    give(value, this.targetGuest, options);
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.sourceGuest as MaybeDisposableType;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}
