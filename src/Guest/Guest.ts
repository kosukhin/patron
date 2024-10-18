import {
  GuestCallback,
  GuestExecutorType,
  GuestType,
  ReceiveOptions,
} from "./GuestCallback";
import { GuestChain } from "./GuestChain";
import { GuestCast } from "./GuestCast";
import { GuestInTheMiddle } from "./GuestInTheMiddle";
import { GuestPool } from "./GuestPool";
import { GuestAware } from "./GuestAware";
import { GuestSync } from "./GuestSync";

export class Guest {
  public callback<P>(receiver: GuestExecutorType<P>) {
    return new GuestCallback(receiver);
  }

  public chain() {
    return new GuestChain();
  }

  public cast<P>(sourceGuest: GuestType<unknown>, targetGuest: GuestType<P>) {
    return new GuestCast(sourceGuest, targetGuest);
  }

  public middleware<P>(
    baseGuest: GuestType<unknown>,
    middleFn: (value: P, options?: ReceiveOptions) => void,
  ) {
    return new GuestInTheMiddle(baseGuest, middleFn);
  }

  public pool(initiator: unknown) {
    return new GuestPool(initiator);
  }

  public aware<P>(guestReceiver: (guest: GuestType<P>) => void) {
    return new GuestAware(guestReceiver);
  }

  public sync<P>(value: P) {
    return new GuestSync(value);
  }
}
