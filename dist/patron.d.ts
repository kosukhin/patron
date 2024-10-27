type GuestIntroduction = "guest" | "patron";
interface ReceiveOptions {
    data?: unknown;
}
type GuestExecutorType<T = unknown> = (value: T, options?: ReceiveOptions) => void;
interface GuestObjectType<T = unknown> {
    receive(value: T, options?: ReceiveOptions): this;
    introduction?(): GuestIntroduction;
}
type GuestType<T = unknown> = GuestExecutorType<T> | GuestObjectType<T>;
declare function give<T>(data: T, guest: GuestType<T>, options?: ReceiveOptions): void;
declare class Guest<T> implements GuestObjectType<T> {
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

declare class GuestCast<T> implements GuestObjectType<T> {
    private sourceGuest;
    private targetGuest;
    constructor(sourceGuest: GuestType<unknown>, targetGuest: GuestType<T>);
    introduction(): "guest" | "patron";
    receive(value: T, options?: ReceiveOptions): this;
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
    resultArray(guest: GuestObjectType<T>): this;
    result(guest: GuestObjectType<T>): this;
    receiveKey<R>(key: string): GuestObjectType<R>;
    private isChainFilled;
}

declare class GuestMiddle<T> implements GuestObjectType<T> {
    private baseGuest;
    private middleFn;
    constructor(baseGuest: GuestType<unknown>, middleFn: (value: T, options?: ReceiveOptions) => void);
    introduction(): "guest" | "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

/**
 * Удалить патрон из всех пулов
 */
declare const removePatronFromPools: (patron: GuestObjectType) => void;
interface PoolType<T = unknown> extends GuestObjectType<T> {
    add(guest: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    remove(patron: GuestObjectType<T>): this;
}
declare class PatronPool<T> implements PoolType<T> {
    private initiator;
    private patrons;
    receive: (value: T, options?: ReceiveOptions) => this;
    constructor(initiator: unknown);
    add(shouldBePatron: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestType<T>): this;
    private sendValueToGuest;
}

declare class GuestPool<T> implements GuestObjectType<T>, PoolType<T> {
    private guests;
    private patronPool;
    constructor(initiator: unknown);
    receive(value: T, options?: ReceiveOptions): this;
    add(guest: GuestType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    private deliverToGuests;
}

interface GuestValueType<T = unknown> extends GuestObjectType<T> {
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
declare class Patron<T> implements GuestObjectType<T> {
    private willBePatron;
    constructor(willBePatron: GuestType<T>);
    introduction(): "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

declare class PatronOnce<T> implements GuestObjectType<T> {
    private baseGuest;
    private received;
    constructor(baseGuest: GuestType<T>);
    introduction(): "patron";
    receive(value: T, options?: ReceiveOptions): this;
}

type SourceType<T = unknown> = GuestAwareType<T> & GuestObjectType<T>;
declare class Source<T> implements SourceType<T> {
    private sourceDocument;
    private pool;
    constructor(sourceDocument: T);
    receive(value: T): this;
    receiving(guest: GuestType<T>): this;
}

export { type ChainType, Guest, GuestAware, type GuestAwareType, GuestCast, GuestChain, type GuestExecutorType, GuestMiddle, type GuestObjectType, GuestPool, GuestSync, type GuestType, type GuestValueType, Patron, PatronOnce, PatronPool, type PoolType, type ReceiveOptions, Source, type SourceType, give, removePatronFromPools };
