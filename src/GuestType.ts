type GuestIntroduction = 'guest' | 'patron';

export interface ReceiveOptions {
  data?: unknown,
}

export interface GuestType<T = unknown> {
  receive(value: T, options?: ReceiveOptions): this;
  introduction?(): GuestIntroduction;
}
