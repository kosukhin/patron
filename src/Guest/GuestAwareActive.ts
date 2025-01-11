import { SourceType } from "../Source/Source";
import { SourceEmpty } from "../Source/SourceEmpty";
import { GuestType } from "./Guest";
import { GuestAwareObjectType } from "./GuestAware";

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/action-type
 */
export interface ActionType<P = any> {
  do(config: P): this;
}

export interface GuestAwareAcitveType<R = unknown, T = unknown> extends GuestAwareObjectType<T>, ActionType<R> {
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-active
 */
export class GuestAwareActive<R, T> implements GuestAwareAcitveType<R, T> {
  private source = new SourceEmpty<T>();

  public constructor(private configExecutor: (config: R, source: SourceType<T>) => void) { }

  public do(config: R): this {
    this.configExecutor(config, this.source);
    return this;
  }

  public value(guest: GuestType<T>): this {
    this.source.value(guest);
    return this;
  }
}
