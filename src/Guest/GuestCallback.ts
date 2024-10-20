type GuestIntroduction = "guest" | "patron";

export interface ReceiveOptions {
  data?: unknown;
}

export type GuestExecutorType<T> = (value: T, options?: ReceiveOptions) => void;

export interface GuestType<T = unknown> {
  receive(value: T, options?: ReceiveOptions): this;
  introduction?(): GuestIntroduction;
}

export class GuestCallback<T> implements GuestType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {}

  public receive(value: T, options?: ReceiveOptions) {
    this.receiver(value, options);
    return this;
  }
}
