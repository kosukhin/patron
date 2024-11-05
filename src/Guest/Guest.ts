type GuestIntroduction = "guest" | "patron";

export interface GiveOptions {
  data?: unknown;
}

export type GuestExecutorType<T = unknown> = (
  value: T,
  options?: GiveOptions,
) => void;

export interface GuestObjectType<T = unknown> {
  give(value: T, options?: GiveOptions): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = unknown> = GuestExecutorType<T> | GuestObjectType<T>;

export function give<T>(data: T, guest: GuestType<T>, options?: GiveOptions) {
  if (typeof guest === "function") {
    guest(data, options);
  } else {
    guest.give(data, options);
  }
}

export class Guest<T> implements GuestObjectType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {}

  public give(value: T, options?: GiveOptions) {
    this.receiver(value, options);
    return this;
  }
}
