import { give, GiveOptions, GuestObjectType, GuestType } from "./Guest";

export interface GuestDisposableType<T = unknown> extends GuestObjectType<T> {
  disposed(value: T | null): boolean;
}

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
