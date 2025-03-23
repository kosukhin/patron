import {
  give,
  GuestExecutorType,
  GuestObjectType,
  GuestType,
} from "../Guest/Guest";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-executor-applied
 */
export class GuestExecutorApplied<T> implements GuestObjectType<T> {
  public give: GuestExecutorType<T, this>;

  public constructor(
    baseGuest: GuestType<T>,
    applier: (executor: GuestExecutorType) => GuestExecutorType,
  ) {
    this.give = applier((v) => give(v, baseGuest)) as GuestExecutorType<
      T,
      this
    >;
  }
}
