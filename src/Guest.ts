import { GuestExecutorType } from './GuestExecutorType';
import {
  GuestType,
  ReceiveOptions,
} from './GuestType';

export class Guest<T> implements GuestType<T> {
  public constructor(private receiver: GuestExecutorType<T>) {}

  public receive(value: T, options?: ReceiveOptions) {
    this.receiver(value, options);
    return this;
  }
}
