import {
  GuestType,
  ReceiveOptions,
} from './GuestType';

/**
 * Патрон - это постоянный посетитель
 */
export class Patron<T> implements GuestType<T> {
  public constructor(private willBePatron: GuestType<T>) {}

  public introduction() {
    return 'patron' as const;
  }

  public receive(value: T, options?: ReceiveOptions): this {
    this.willBePatron.receive(value, options);
    return this;
  }
}
