import { GuestAwareType } from './GuestAwareType';
import { GuestType } from './GuestType';

export type SourceType<T = unknown> = GuestAwareType<T> & GuestType<T>;
