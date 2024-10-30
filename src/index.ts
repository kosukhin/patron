import { give, Guest } from "./Guest/Guest";
import { PatronPool, removePatronFromPools } from "./Patron/PatronPool";
import { GuestAware } from "./Guest/GuestAware";
import { GuestCast } from "./Guest/GuestCast";
import { GuestChain } from "./Guest/GuestChain";
import { GuestMiddle } from "./Guest/GuestMiddle";
import { GuestPool } from "./Guest/GuestPool";
import { GuestSync } from "./Guest/GuestSync";
import { GuestObject } from "./Guest/GuestObject";
import { Patron } from "./Patron/Patron";
import { PatronOnce } from "./Patron/PatronOnce";
import { Source } from "./Source/Source";
import { Factory } from "./Factory/Factory";

export * from "./Guest/GuestAware";
export * from "./Guest/Guest";
export * from "./Guest/GuestCast";
export * from "./Guest/GuestChain";
export * from "./Guest/GuestMiddle";
export * from "./Guest/GuestPool";
export * from "./Guest/GuestSync";
export * from "./Patron/Patron";
export * from "./Patron/PatronOnce";
export * from "./Patron/PatronPool";
export * from "./Source/Source";
export * from "./Guest/GuestObject";
export * from "./Factory/Factory";

declare var globalThis: any;

if (globalThis) {
  globalThis["GUEST_LIBRARY"] = {
    give,
    removePatronFromPools,
    GuestAware,
    Guest,
    GuestCast,
    GuestChain,
    GuestMiddle,
    GuestPool,
    GuestSync,
    GuestObject,
    Patron,
    PatronOnce,
    PatronPool,
    Source,
    Factory,
  };
}
