import { GuestType } from './GuestType';

export interface ChainType<T = unknown> {
  result(guest: GuestType<T>): this;
  resultArray(guest: GuestType<T>): this;
  receiveKey<R>(key: string): GuestType<R>;
}
