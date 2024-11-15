import { PatronPool as PatronPool$1 } from 'src/Patron/PatronPool';

type GuestIntroduction = "guest" | "patron";
interface GiveOptions {
    data?: unknown;
}
type GuestExecutorType<T = unknown> = (value: T, options?: GiveOptions) => void;
interface GuestObjectType<T = unknown> {
    give(value: T, options?: GiveOptions): this;
    introduction?(): GuestIntroduction;
}
type GuestType<T = unknown> = GuestExecutorType<T> | GuestObjectType<T>;
declare function give<T>(data: T, guest: GuestType<T>, options?: GiveOptions): void;
declare class Guest<T> implements GuestObjectType<T> {
    private receiver;
    constructor(receiver: GuestExecutorType<T>);
    give(value: T, options?: GiveOptions): this;
}

interface GuestAwareType<T = unknown> {
    value(guest: GuestType<T>): unknown;
}
declare class GuestAware<T = unknown> implements GuestAwareType<T> {
    private guestReceiver;
    constructor(guestReceiver: (guest: GuestType<T>) => void);
    value(guest: GuestType<T>): GuestType<T>;
}

declare class GuestCast<T> implements GuestObjectType<T> {
    private sourceGuest;
    private targetGuest;
    constructor(sourceGuest: GuestType<unknown>, targetGuest: GuestType<T>);
    introduction(): "guest" | "patron";
    give(value: T, options?: GiveOptions): this;
}

interface ChainType<T = unknown> {
    result(guest: GuestObjectType<T>): this;
    resultArray(guest: GuestObjectType<T>): this;
    receiveKey<R>(key: string): GuestObjectType<R>;
}
declare class GuestChain<T> implements ChainType<T> {
    private theChain;
    private keysKnown;
    private keysFilled;
    private filledChainPool;
    constructor();
    resultArray(guest: GuestType<T>): this;
    result(guest: GuestType<T>): this;
    receiveKey<R>(key: string): GuestObjectType<R>;
    private isChainFilled;
}

declare const removePatronFromPools: (patron: GuestObjectType) => void;
declare const isPatronInPools: (patron: GuestObjectType) => boolean;
interface PoolType<T = unknown> extends GuestObjectType<T> {
    add(guest: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    size(): number;
}
declare class PatronPool<T> implements PoolType<T> {
    private initiator;
    private patrons;
    give: (value: T, options?: GiveOptions) => this;
    constructor(initiator: unknown);
    size(): number;
    add(shouldBePatron: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    private sendValueToGuest;
    private guestDisposed;
}

declare class GuestPool<T> implements GuestObjectType<T>, PoolType<T> {
    private guests;
    private patronPool;
    constructor(initiator: unknown);
    give(value: T, options?: GiveOptions): this;
    add(guest: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    size(): number;
    private deliverToGuests;
}

interface GuestValueType<T = unknown> extends GuestObjectType<T> {
    value(): T;
}
declare class GuestSync<T> implements GuestValueType<T> {
    private theValue;
    constructor(theValue: T);
    give(value: T): this;
    value(): T;
}

declare class GuestObject<T> implements GuestObjectType<T> {
    private baseGuest;
    constructor(baseGuest: GuestType<T>);
    give(value: T, options?: GiveOptions): this;
    introduction(): "guest" | "patron";
}

interface GuestDisposableType<T = unknown> extends GuestObjectType<T> {
    disposed(value: T | null): boolean;
}
declare class GuestDisposable<T> implements GuestDisposableType<T> {
    private guest;
    private disposeCheck;
    constructor(guest: GuestType, disposeCheck: (value: T | null) => boolean);
    disposed(value: T | null): boolean;
    give(value: T, options?: GiveOptions): this;
}

declare class Patron<T> implements GuestDisposableType<T> {
    private willBePatron;
    constructor(willBePatron: GuestType<T>);
    introduction(): "patron";
    give(value: T, options?: GiveOptions): this;
    disposed(value: T | null): boolean;
}

declare class PatronOnce<T> implements GuestObjectType<T> {
    private baseGuest;
    private received;
    constructor(baseGuest: GuestType<T>);
    introduction(): "patron";
    give(value: T, options?: GiveOptions): this;
}

interface PoolAware<T = unknown> {
    pool(): PatronPool<T>;
}
type SourceType<T = unknown> = GuestAwareType<T> & GuestObjectType<T> & PoolAware<T>;
declare class Source<T> implements SourceType<T> {
    private sourceDocument;
    private thePool;
    constructor(sourceDocument: T);
    pool(): PatronPool<unknown>;
    give(value: T): this;
    value(guest: GuestType<T>): this;
}

declare class SourceEmpty<T> implements SourceType<T> {
    private baseSource;
    value(guest: GuestType<T>): this;
    give(value: T): this;
    pool(): PatronPool$1<T>;
}

interface Prototyped<T> {
    prototype: T;
}
interface FactoryType<T> {
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
declare class Factory<T> implements FactoryType<T> {
    private constructorFn;
    private factories;
    constructor(constructorFn: Prototyped<T>, factories?: Record<string, unknown>);
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

export { type ChainType, Factory, type FactoryType, type GiveOptions, Guest, GuestAware, type GuestAwareType, GuestCast, GuestChain, GuestDisposable, type GuestDisposableType, type GuestExecutorType, GuestObject, type GuestObjectType, GuestPool, GuestSync, type GuestType, type GuestValueType, Patron, PatronOnce, PatronPool, type PoolAware, type PoolType, Source, SourceEmpty, type SourceType, give, isPatronInPools, removePatronFromPools };
