type GuestIntroduction = "guest" | "patron";
interface ReceiveOptions {
    data?: unknown;
}
type GuestExecutorType<T> = (value: T, options?: ReceiveOptions) => void;
interface GuestType<T = unknown> {
    receive(value: T, options?: ReceiveOptions): this;
    introduction?(): GuestIntroduction;
}
declare class GuestCallback<T> implements GuestType<T> {
    private receiver;
    constructor(receiver: GuestExecutorType<T>);
    receive(value: T, options?: ReceiveOptions): this;
}

interface ChainType<T = unknown> {
    result(guest: GuestType<T>): this;
    resultArray(guest: GuestType<T>): this;
    receiveKey<R>(key: string): GuestType<R>;
}
declare class GuestChain<T> implements ChainType<T> {
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
 * Удалить патрон из всех пулов
 */
declare const removePatronFromPools: (patron: GuestType) => void;
interface PoolType<T = unknown> extends GuestType<T> {
    add(guest: GuestType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    remove(patron: GuestType<T>): this;
}
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

interface GuestAwareType<T = unknown> {
    receiving(guest: GuestType<T>): unknown;
}
declare class GuestAware<T = unknown> implements GuestAwareType<T> {
    private guestReceiver;
    constructor(guestReceiver: (guest: GuestType<T>) => void);
    receiving(guest: GuestType<T>): GuestType<T>;
}

type SourceType<T = unknown> = GuestAwareType<T> & GuestType<T>;
declare class SourceOfValue<T> implements SourceType<T> {
    private sourceDocument;
    private pool;
    constructor(sourceDocument: T);
    receive(value: T): this;
    receiving(guest: GuestType<T>): this;
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

declare class Guest {
    callback<P>(receiver: GuestExecutorType<P>): GuestCallback<P>;
    chain(): GuestChain<unknown>;
    cast<P>(sourceGuest: GuestType<unknown>, targetGuest: GuestType<P>): GuestCast<P>;
    middleware<P>(baseGuest: GuestType<unknown>, middleFn: (value: P, options?: ReceiveOptions) => void): GuestInTheMiddle<P>;
    pool(initiator: unknown): GuestPool<unknown>;
    aware<P>(guestReceiver: (guest: GuestType<P>) => void): GuestAware<P>;
    sync<P>(value: P): GuestSync<P>;
}

/**
 * Патрон - это постоянный посетитель
 */
declare class PatronOfGuest<T> implements GuestType<T> {
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

declare class Patron {
    ofGuest<P>(willBePatron: GuestType<P>): PatronOfGuest<P>;
    once<P>(baseGuest: GuestType<P>): PatronOnce<P>;
    pool(initiator: unknown): PatronPool<unknown>;
}

declare class Source {
    ofValue<P>(sourceDocument: P): SourceOfValue<P>;
    applySources<P>(target: P, methodsSources: Record<string, unknown[]>): {
        [k: string]: any;
    };
}

export { type ChainType, Guest, GuestCallback, GuestChain, type GuestExecutorType, GuestSync, type GuestType, type GuestValueType, Patron, PatronPool, type PoolType, type ReceiveOptions, Source, SourceOfValue, type SourceType, removePatronFromPools };
