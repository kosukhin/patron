import { PatronOfGuest } from "./PatronOfGuest";
import { GuestType } from "../Guest/GuestCallback";
import { PatronOnce } from "./PatronOnce";
import { PatronPool } from "./PatronPool";

export class Patron {
  public ofGuest<P>(willBePatron: GuestType<P>) {
    return new PatronOfGuest(willBePatron);
  }

  public once<P>(baseGuest: GuestType<P>) {
    return new PatronOnce(baseGuest);
  }

  public pool(initiator: unknown) {
    return new PatronPool(initiator);
  }
}
