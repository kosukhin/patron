type GuestIntroduction = "guest" | "patron";

export interface GiveOptions {
  data?: unknown;
}

export type GuestExecutorType<T = any> = (
  value: T,
  options?: GiveOptions,
) => void;

export interface GuestObjectType<T = any> {
  give(value: T, options?: GiveOptions): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/give
 */
export function give<T>(data: T, guest: GuestType<T>, options?: GiveOptions) {
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
  return typeof mbGuest === "function" || typeof mbGuest?.give === "function";
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest
 */
export class Guest<T> implements GuestObjectType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {}

  public give(value: T, options?: GiveOptions) {
    this.receiver(value, options);
    return this;
  }
}
