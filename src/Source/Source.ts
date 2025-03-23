import { give, GuestType } from "../Guest/Guest";

export type SourceExecutorType<T> = (guest: GuestType<T>) => unknown;

export interface SourceObjectType<T> {
  value: SourceExecutorType<T>;
}

export type SourceType<T = any> = SourceExecutorType<T> | SourceObjectType<T>;

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/value
 */
export function value<T>(source: SourceType<T>, guest: GuestType<T>) {
  if (source === undefined) {
    throw new Error("value didnt receive source argument");
  }
  if (guest === undefined) {
    throw new Error("value didnt receive guest argument");
  }
  if (typeof source === "function") {
    return source(guest);
  } else {
    return source.value(guest);
  }
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/is-source
 */
export function isSource(mbSource: any): mbSource is SourceType {
  if (mbSource === undefined) {
    throw new Error("isSource didnt receive mbSource argument");
  }
  return (
    typeof mbSource === "function" || typeof mbSource?.value === "function"
  );
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/source
 */
export class Source<T = any> implements SourceObjectType<T> {
  public constructor(private source: SourceType<T>) {
    if (source === undefined) {
      throw new Error("Source constructor didnt receive executor function");
    }
  }

  public value(guest: GuestType<T>): GuestType<T> {
    value(this.source, guest);
    return guest;
  }
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/source-of
 */
export const sourceOf = <T>(value: T) => new Source<T>((g) => give(value, g));
