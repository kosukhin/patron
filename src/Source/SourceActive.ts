import { GuestType } from "../Guest/Guest";
import { SourceObjectType } from "./Source";
import { SourceWithPool, SourceWithPoolType } from "./SourceWithPool";

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/action-type
 */
export interface ActionType<P = any> {
  do(config: P): this;
}

export interface SourceAcitveType<R = unknown, T = unknown>
  extends SourceObjectType<T>,
    ActionType<R> {}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/source-active
 */
export class SourceActive<R, T> implements SourceAcitveType<R, T> {
  private source = new SourceWithPool<T>();

  public constructor(
    private configExecutor: (config: R, source: SourceWithPoolType<T>) => void,
  ) {
    if (configExecutor === undefined) {
      throw new Error(
        "SourceActive constructor didnt receive executor function",
      );
    }
  }

  public do(config: R): this {
    this.configExecutor(config, this.source);
    return this;
  }

  public value(guest: GuestType<T>): this {
    this.source.value(guest);
    return this;
  }
}
