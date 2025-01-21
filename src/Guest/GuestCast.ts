import {
  GuestDisposableType,
  MaybeDisposableType,
} from "./GuestDisposable";
import { give, GiveOptions, GuestType } from "./Guest";
import { PoolAwareOptions } from "../Patron/PatronOnce";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-cast
 */
export class GuestCast<T> implements GuestDisposableType<T> {
  public constructor(
    private sourceGuest: GuestType<any>,
    private targetGuest: GuestType<T>,
  ) { }

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
    give(value, this.targetGuest, {
      ...options,
      data: {
        ...(options?.data ?? {}),
        castedGuest: (options?.data as PoolAwareOptions)?.castedGuest ?? this,
      }
    });
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.sourceGuest as MaybeDisposableType;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}
