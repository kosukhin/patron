import { GuestExecutorType, GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestExecutorApplied } from "../Guest/GuestExecutorApplied";

/**
 * @url https://kosukhin.github.io/patron.site/#/patron/patron-executor-applied
 */
export class PatronExecutorApplied<T> implements GuestObjectType<T> {
  private guestApplied: GuestExecutorApplied<T>;

  public constructor(
    baseGuest: GuestType<T>,
    applier: (executor: GuestExecutorType) => GuestExecutorType,
  ) {
    this.guestApplied = new GuestExecutorApplied(baseGuest, applier);
  }

  public give(value: T): this {
    this.guestApplied.give(value);
    return this;
  }

  public introduction(): "guest" | "patron" {
    return "patron";
  }
}
