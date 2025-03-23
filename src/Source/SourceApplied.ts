import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { SourceObjectType, SourceType, value } from "../Source/Source";

/**
 * @url https://kosukhin.github.io/patron.site/#/source/source-applied
 */
export class SourceApplied<T, R> implements SourceObjectType<R> {
  public constructor(
    private baseSource: SourceType<T>,
    private applier: (v: T) => R,
  ) {}

  public value(g: GuestType<R>) {
    value(
      this.baseSource,
      new GuestCast(g, (v) => {
        give(this.applier(v), g);
      }),
    );
    return this;
  }
}
