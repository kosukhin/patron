import { GuestAwareType } from "./GuestAwareType";
import { GuestType } from "./GuestType";

export type CacheType<T = unknown> = GuestType<T> & GuestAwareType<T>;
