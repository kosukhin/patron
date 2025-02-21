import { give, GiveOptions, GuestObjectType, GuestType } from "./Guest";

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
  ) {}

  public disposed(value: T | null): boolean {
    return this.disposeCheck(value);
  }

  public give(value: T, options?: GiveOptions): this {
    give(value, this.guest, options);
    return this;
  }
}
