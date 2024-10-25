type GuestIntroduction = "guest" | "patron";

export interface ReceiveOptions {
  data?: unknown;
}

export type GuestExecutorType<T = unknown> = (
  value: T,
  options?: ReceiveOptions,
) => void;

export interface GuestObjectType<T = unknown> {
  receive(value: T, options?: ReceiveOptions): this;
  introduction?(): GuestIntroduction;
}

export type GuestType<T = unknown> = GuestExecutorType<T> | GuestObjectType<T>;

export function give<T>(
  data: T,
  guest: GuestType<T>,
  options?: ReceiveOptions,
) {
  if (typeof guest === "function") {
    guest(data, options);
  } else {
    guest.receive(data, options);
  }
}

export class Guest<T> implements GuestObjectType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {}

  public receive(value: T, options?: ReceiveOptions) {
    this.receiver(value, options);
    return this;
  }
}
