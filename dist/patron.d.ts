import { GuestAwareType as GuestAwareType$1 } from 'src/GuestAware';

type GuestIntroduction = "guest" | "patron";
interface ReceiveOptions {
    data?: unknown;
}
type GuestExecutorType<T> = (value: T, options?: ReceiveOptions) => void;
interface GuestType<T = unknown> {
    receive(value: T, options?: ReceiveOptions): this;
    introduction?(): GuestIntroduction;
}
declare class Guest<T> implements GuestType<T> {
    private receiver;
    constructor(receiver: GuestExecutorType<T>);
    receive(value: T, options?: ReceiveOptions): this;
}

interface GuestAwareType<T = unknown> {
    receiving(guest: GuestType<T>): unknown;
}
declare class GuestAware<T = unknown> implements GuestAwareType<T> {
    private guestReceiver;
    constructor(guestReceiver: (guest: GuestType<T>) => void);
    receiving(guest: GuestType<T>): GuestType<T>;
}

type CacheType<T = unknown> = GuestType<T> & GuestAwareType<T>;
declare class Cache<T> implements CacheType<T> {
    private defaultValue;
    private theCache;
    private pool;
    constructor(initiator: unknown, defaultValue?: T | null, theCache?: T | null);
    receive(value: T, options?: ReceiveOptions): this;
    receiving(guest: GuestType<T>): this;
}

interface ChainType<T = unknown> {
    result(guest: GuestType<T>): this;
    resultArray(guest: GuestType<T>): this;
    receiveKey<R>(key: string): GuestType<R>;
}
declare class Chain<T> implements ChainType<T> {
    private theChain;
    private keysKnown;
    private keysFilled;
    private filledChainPool;
    constructor();
    resultArray(guest: GuestType<T>): this;
    result(guest: GuestType<T>): this;
    receiveKey<R>(key: string): GuestType<R>;
    private isChainFilled;
}

interface Prototyped$1<T> {
    prototype: T;
}
interface FactoryType<T> {
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
declare class Factory<T> implements FactoryType<T> {
    private constructorFn;
    constructor(constructorFn: Prototyped$1<T>);
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

declare class FactoryDynamic<T> implements FactoryType<T> {
    private creationFn;
    constructor(creationFn: (...args: unknown[]) => T);
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

interface Prototyped<T> {
    prototype: T;
}
declare class FactoryWithFactories<T> implements FactoryType<T> {
    private constructorFn;
    private factories;
    constructor(constructorFn: Prototyped<T>, factories?: Record<string, unknown>);
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

declare class GuestCast<T> implements GuestType<T> {
    private sourceGuest;
    private targetGuest;
    constructor(sourceGuest: GuestType<unknown>, targetGuest: GuestType<T>);
    introduction(): "guest" | "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

declare class GuestInTheMiddle<T> implements GuestType<T> {
    private baseGuest;
    private middleFn;
    constructor(baseGuest: GuestType<unknown>, middleFn: (value: T, options?: ReceiveOptions) => void);
    introduction(): "guest" | "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

interface PoolType<T = unknown> extends GuestType<T> {
    add(guest: GuestType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    remove(patron: GuestType<T>): this;
}

declare class GuestPool<T> implements GuestType<T>, PoolType<T> {
    private guests;
    private patronPool;
    constructor(initiator: unknown);
    receive(value: T, options?: ReceiveOptions): this;
    add(guest: GuestType<T>): this;
    remove(patron: GuestType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    private deliverToGuests;
}

interface GuestValueType<T = unknown> extends GuestType<T> {
    value(): T;
}
declare class GuestSync<T> implements GuestValueType<T> {
    private theValue;
    constructor(theValue: T);
    receive(value: T): this;
    value(): T;
}

/**
 * Патрон - это постоянный посетитель
 */
declare class Patron<T> implements GuestType<T> {
    private willBePatron;
    constructor(willBePatron: GuestType<T>);
    introduction(): "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

declare class PatronOnce<T> implements GuestType<T> {
    private baseGuest;
    private received;
    constructor(baseGuest: GuestType<T>);
    introduction(): "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

/**
 * Удалить патрон из всех пулов
 */
declare const removePatronFromPools: (patron: GuestType) => void;
declare class PatronPool<T> implements PoolType<T> {
    private initiator;
    private patrons;
    receive: (value: T, options?: ReceiveOptions) => this;
    constructor(initiator: unknown);
    add(shouldBePatron: GuestType<T>): this;
    remove(patron: GuestType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    private sendValueToGuest;
}

type SourceType<T = unknown> = GuestAwareType$1<T> & GuestType<T>;
declare class Source<T> implements SourceType<T> {
    private sourceDocument;
    private pool;
    constructor(sourceDocument: T);
    receive(value: T): this;
    receiving(guest: GuestType<T>): this;
}

export { Cache, type CacheType, Chain, type ChainType, Factory, FactoryDynamic, type FactoryType, FactoryWithFactories, Guest, GuestAware, type GuestAwareType, GuestCast, type GuestExecutorType, GuestInTheMiddle, GuestPool, GuestSync, type GuestType, type GuestValueType, Patron, PatronOnce, PatronPool, type ReceiveOptions, Source, type SourceType, removePatronFromPools };
