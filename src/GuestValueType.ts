import { GuestType } from './GuestType';

export interface GuestValueType<T = unknown> extends GuestType<T> {
  value(): T;
}
