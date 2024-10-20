export * from "./Guest/GuestCallback";
export * from "./Guest/GuestChain";
export * from "./Guest/GuestSync";
export * from "./Patron/PatronPool";
export * from "./Source/SourceOfValue";

import { Guest } from "./Guest/Guest";
import { Patron } from "./Patron/Patron";
import { Source } from "./Source/Source";

export { Guest, Patron, Source };

declare var window: any;

if (window) {
  window["GUEST_LIBRARY"] = {
    guest: new Guest(),
    patron: new Patron(),
    source: new Source(),
  };
}
