import { GuestType } from './GuestType';

export interface GuestAwareType<T = unknown> {
  receiving(guest: GuestType<T>): unknown;
}
