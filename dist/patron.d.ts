import { GuestAwareObjectType as GuestAwareObjectType$1 } from 'src/Guest/GuestAware';

type GuestIntroduction = "guest" | "patron";
interface GiveOptions {
    data?: unknown;
}
type GuestExecutorType<T = any> = (value: T, options?: GiveOptions) => void;
interface GuestObjectType<T = any> {
    give(value: T, options?: GiveOptions): this;
    introduction?(): GuestIntroduction;
}
type GuestType<T = any> = GuestExecutorType<T> | GuestObjectType<T>;
/**
 * @url https://kosukhin.github.io/patron.site/#/utils/give
 */
declare function give<T>(data: T, guest: GuestType<T>, options?: GiveOptions): void;
/**
 * @url https://kosukhin.github.io/patron.site/#/guest
 */
declare class Guest<T> implements GuestObjectType<T> {
    private receiver;
    constructor(receiver: GuestExecutorType<T>);
    give(value: T, options?: GiveOptions): this;
}

type GuestAwareExecutorType<T> = (guest: GuestType<T>) => unknown;
interface GuestAwareObjectType<T> {
    value: GuestAwareExecutorType<T>;
}
type GuestAwareType<T = any> = GuestAwareExecutorType<T> | GuestAwareObjectType<T>;
declare function value<T>(guestAware: GuestAwareType<T>, guest: GuestType<T>): unknown;
/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware
 */
declare class GuestAware<T = any> implements GuestAwareObjectType<T> {
    private guestAware;
    constructor(guestAware: GuestAwareType<T>);
    value(guest: GuestType<T>): GuestType<T>;
}

interface Prototyped<T> {
    prototype: T;
}
interface FactoryType<T> {
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
/**
 * @url https://kosukhin.github.io/patron.site/#/utils/factory
 */
declare class Factory<T> implements FactoryType<T> {
    private constructorFn;
    private factories;
    constructor(constructorFn: Prototyped<T>, factories?: Record<string, unknown>);
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-sequence
 */
declare class GuestAwareSequence<T, TG> implements GuestAwareObjectType<TG[]> {
    private baseSource;
    private targetSourceFactory;
    constructor(baseSource: GuestAwareType<T[]>, targetSourceFactory: FactoryType<GuestAwareType<TG>>);
    value(guest: GuestType<TG[]>): this;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-map
 */
declare class GuestAwareMap<T, TG> implements GuestAwareObjectType<TG[]> {
    private baseSource;
    private targetSourceFactory;
    constructor(baseSource: GuestAwareType<T[]>, targetSourceFactory: FactoryType<GuestAwareType<TG>>);
    value(guest: GuestType<TG[]>): this;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-race
 */
declare class GuestAwareRace<T> implements GuestAwareObjectType<T> {
    private guestAwares;
    constructor(guestAwares: GuestAwareType<T>[]);
    value(guest: GuestType<T>): this;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/remove-patron-from-pools
 */
declare const removePatronFromPools: (patron: GuestObjectType) => void;
/**
 * @url https://kosukhin.github.io/patron.site/#/utils/is-patron-in-pools
 */
declare const isPatronInPools: (patron: GuestObjectType) => boolean;
interface PoolType<T = any> extends GuestObjectType<T> {
    add(guest: GuestObjectType<T>): this;
    distribute(receiving: T, possiblePatron: GuestObjectType<T>): this;
    remove(patron: GuestObjectType<T>): this;
    size(): number;
}
/**
 * @url https://kosukhin.github.io/patron.site/#/patron/patron-pool
 */
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

interface PoolAware<T = any> {
    pool(): PatronPool<T>;
}
/**
 * @url https://kosukhin.github.io/patron.site/#/source
 */
type SourceType<T = any> = GuestAwareObjectType<T> & GuestObjectType<T> & PoolAware<T>;
declare class Source<T> implements SourceType<T> {
    private sourceDocument;
    private thePool;
    constructor(sourceDocument: T);
    pool(): PatronPool<unknown>;
    give(value: T): this;
    value(guest: GuestType<T>): this;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/action-type
 */
interface ActionType<P = any> {
    do(config: P): this;
}
interface GuestAwareAcitveType<R = unknown, T = unknown> extends GuestAwareObjectType<T>, ActionType<R> {
}
/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-active
 */
declare class GuestAwareActive<R, T> implements GuestAwareAcitveType<R, T> {
    private configExecutor;
    private source;
    constructor(configExecutor: (config: R, source: SourceType<T>) => void);
    do(config: R): this;
    value(guest: GuestType<T>): this;
}

interface GuestDisposableType<T = any> extends GuestObjectType<T> {
    disposed(value: T | null): boolean;
}
type MaybeDisposableType<T = any> = Partial<GuestDisposableType<T>>;
/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-disposable
 */
declare class GuestDisposable<T> implements GuestDisposableType<T> {
    private guest;
    private disposeCheck;
    constructor(guest: GuestType, disposeCheck: (value: T | null) => boolean);
    disposed(value: T | null): boolean;
    give(value: T, options?: GiveOptions): this;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-cast
 */
declare class GuestCast<T> implements GuestDisposableType<T> {
    private sourceGuest;
    private targetGuest;
    constructor(sourceGuest: GuestType<any>, targetGuest: GuestType<T>);
    introduction(): "guest" | "patron";
    give(value: T, options?: GiveOptions): this;
    disposed(value: T | null): boolean;
}

interface GuestAwareAllType<T = any> extends GuestAwareObjectType$1<T> {
    valueArray(guest: GuestObjectType<T>): this;
    guestKey<R>(key: string): GuestObjectType<R>;
}
/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-aware-all
 */
declare class GuestAwareAll<T> implements GuestAwareAllType<T> {
    private theAll;
    private keysKnown;
    private keysFilled;
    private filledAllPool;
    constructor();
    valueArray(guest: GuestType<T>): this;
    value(guest: GuestType<T>): this;
    guestKey<R>(key: string): GuestObjectType<R>;
    private isAllFilled;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-pool
 */
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

interface GuestValueType<T = any> extends GuestObjectType<T> {
    value(): T;
}
/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-sync
 */
declare class GuestSync<T> implements GuestValueType<T> {
    private theValue;
    constructor(theValue: T);
    give(value: T): this;
    value(): T;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/guest-object
 */
declare class GuestObject<T> implements GuestDisposableType<T> {
    private baseGuest;
    constructor(baseGuest: GuestType<T>);
    give(value: T, options?: GiveOptions): this;
    introduction(): "guest" | "patron";
    disposed(value: T | null): boolean;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/patron
 */
declare class Patron<T> implements GuestDisposableType<T> {
    private willBePatron;
    constructor(willBePatron: GuestType<T>);
    introduction(): "patron";
    give(value: T, options?: GiveOptions): this;
    disposed(value: T | null): boolean;
}

type PoolAwareOptions = {
    pool?: PoolType;
    castedGuest?: GuestObjectType;
};
/**
 * @url https://kosukhin.github.io/patron.site/#/patron/patron-once
 */
declare class PatronOnce<T> implements GuestDisposableType<T> {
    private baseGuest;
    private received;
    constructor(baseGuest: GuestType<T>);
    introduction(): "patron";
    give(value: T, options?: GiveOptions): this;
    disposed(value: T | null): boolean;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/source-dynamic
 */
declare class SourceDynamic<T = unknown> implements SourceType<T> {
    private baseGuest;
    private baseGuestAware;
    constructor(baseGuest: GuestType<T>, baseGuestAware: GuestAwareType<T>);
    value(guest: GuestType<T>): this;
    give(value: T): this;
    pool(): PatronPool<T>;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/source/source-empty
 */
declare class SourceEmpty<T> implements SourceType<T> {
    private baseSource;
    value(guest: GuestType<T>): this;
    give(value: T): this;
    pool(): PatronPool<T>;
}

/**
 * @url https://kosukhin.github.io/patron.site/#/utils/module
 */
declare class Module<T> implements FactoryType<T> {
    private buildingFn;
    constructor(buildingFn: (...args: any[]) => T);
    create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

export { type ActionType, Factory, type FactoryType, type GiveOptions, Guest, GuestAware, type GuestAwareAcitveType, GuestAwareActive, GuestAwareAll, type GuestAwareAllType, type GuestAwareExecutorType, GuestAwareMap, type GuestAwareObjectType, GuestAwareRace, GuestAwareSequence, type GuestAwareType, GuestCast, GuestDisposable, type GuestDisposableType, type GuestExecutorType, GuestObject, type GuestObjectType, GuestPool, GuestSync, type GuestType, type GuestValueType, type MaybeDisposableType, Module, Patron, PatronOnce, PatronPool, type PoolAware, type PoolAwareOptions, type PoolType, Source, SourceDynamic, SourceEmpty, type SourceType, give, isPatronInPools, removePatronFromPools, value };
