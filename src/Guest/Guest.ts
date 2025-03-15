type GuestIntroduction = "guest" | "patron";

export interface GiveOptions {
  data?: unknown;
}

export type GuestExecutorType<T = any, This = void> = (
  value: T,
  options?: GiveOptions,
) => This;

export interface GuestObjectType<T = any> {
  give(value: T, options?: GiveOptions): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/give
 */
export function give<T>(data: T, guest: GuestType<T>, options?: GiveOptions) {
  if (data === undefined) {
    throw new Error("give didnt receive data argument");
  }
  if (guest === undefined) {
    throw new Error("give didnt receive guest argument");
  }
  if (typeof guest === "function") {
    guest(data, options);
  } else {
    guest.give(data, options);
  }
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/is-guest
 */
export function isGuest(mbGuest: any): mbGuest is GuestType {
  if (mbGuest === undefined) {
    throw new Error("isGuest didnt receive mbGuest argument");
  }
  return typeof mbGuest === "function" || typeof mbGuest?.give === "function";
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest
 */
export class Guest<T> implements GuestObjectType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {
    if (!receiver) {
      throw new Error("reseiver function was not passed to Guest constructor");
    }
  }

  public give(value: T, options?: GiveOptions) {
    this.receiver(value, options);
    return this;
  }
}
