import { GuestType } from './GuestType';

export interface PoolType<T = unknown> extends GuestType<T>{
  add(guest: GuestType<T>): this;
  distribute(receiving: T, possiblePatron: GuestType<T>): this;
  remove(patron: GuestType<T>): this;
}
