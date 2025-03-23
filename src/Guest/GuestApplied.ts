import { give, GuestObjectType, GuestType } from "../Guest/Guest";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-applied
 */
export class GuestApplied<T, R> implements GuestObjectType<T> {
  public constructor(
    private baseGuest: GuestType<R>,
    private applier: (value: T) => R,
  ) {}

  public give(value: T): this {
    give(this.applier(value), this.baseGuest);
    return this;
  }
}
