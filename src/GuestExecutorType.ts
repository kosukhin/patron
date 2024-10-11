import { ReceiveOptions } from './GuestType';

export type GuestExecutorType<T> = (value: T, options?: ReceiveOptions) => void;
