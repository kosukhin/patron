import { give, Guest } from "./Guest/Guest";
import { PatronPool, removePatronFromPools } from "./Patron/PatronPool";
import { GuestAware } from "./Guest/GuestAware";
import { GuestCast } from "./Guest/GuestCast";
import { GuestChain } from "./Guest/GuestChain";
import { GuestInTheMiddle } from "./Guest/GuestInTheMiddle";
import { GuestPool } from "./Guest/GuestPool";
import { GuestSync } from "./Guest/GuestSync";
import { Patron } from "./Patron/Patron";
import { PatronOnce } from "./Patron/PatronOnce";
import { SourceOfValue } from "./Source/SourceOfValue";

export * from "./Guest/GuestAware";
export * from "./Guest/Guest";
export * from "./Guest/GuestCast";
export * from "./Guest/GuestChain";
export * from "./Guest/GuestInTheMiddle";
export * from "./Guest/GuestPool";
export * from "./Guest/GuestSync";
export * from "./Patron/Patron";
export * from "./Patron/PatronOnce";
export * from "./Patron/PatronPool";
export * from "./Source/SourceOfValue";

declare var globalThis: any;

if (globalThis) {
  globalThis["GUEST_LIBRARY"] = {
    give,
    removePatronFromPools,
    GuestAware,
    Guest,
    GuestCast,
    GuestChain,
    GuestInTheMiddle,
    GuestPool,
    GuestSync,
    Patron,
    PatronOnce,
    PatronPool,
    SourceOfValue,
  };
}
