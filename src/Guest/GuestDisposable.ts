import { give, GuestObjectType, GuestType } from "./Guest";

export interface GuestDisposableType<T = any> extends GuestObjectType<T> {
  disposed(value: T | null): boolean;
}

export type MaybeDisposableType<T = any> = Partial<GuestDisposableType<T>>;

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-disposable
 */
export class GuestDisposable<T> implements GuestDisposableType<T> {
  public constructor(
    private guest: GuestType,
    private disposeCheck: (value: T | null) => boolean,
  ) {
    if (guest === undefined) {
      throw new Error("GuestDisposable didnt receive guest argument");
    }
    if (disposeCheck === undefined) {
      throw new Error("GuestDisposable didnt receive disposeCheck argument");
    }
  }

  public disposed(value: T | null): boolean {
    return this.disposeCheck(value);
  }

  public give(value: T): this {
    give(value, this.guest);
    return this;
  }
}
