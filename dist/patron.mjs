function value(guestAware, guest) {
  if (typeof guestAware === "function") {
    return guestAware(guest);
  } else {
    return guestAware.value(guest);
  }
}
class GuestAware {
  constructor(guestAware) {
    this.guestAware = guestAware;
  }
  value(guest) {
    value(this.guestAware, guest);
    return guest;
  }
}

function give(data, guest, options) {
  if (typeof guest === "function") {
    guest(data, options);
  } else {
    guest.give(data, options);
  }
}
class Guest {
  constructor(receiver) {
    this.receiver = receiver;
  }
  give(value, options) {
    this.receiver(value, options);
    return this;
  }
}

class GuestCast {
  constructor(sourceGuest, targetGuest) {
    this.sourceGuest = sourceGuest;
    this.targetGuest = targetGuest;
  }
  introduction() {
    if (typeof this.sourceGuest === "function") {
      return "guest";
    }
    if (!this.sourceGuest.introduction) {
      return "guest";
    }
    return this.sourceGuest.introduction();
  }
  give(value, options) {
    give(value, this.targetGuest, options);
    return this;
  }
  disposed(value) {
    const maybeDisposable = this.sourceGuest;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
const poolSets = /* @__PURE__ */ new Map();
const removePatronFromPools = (patron) => {
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};
const isPatronInPools = (patron) => {
  let inPool = false;
  poolSets.forEach((pool) => {
    if (!inPool) {
      inPool = pool.has(patron);
    }
  });
  return inPool;
};
class PatronPool {
  constructor(initiator) {
    this.initiator = initiator;
    __publicField$6(this, "patrons");
    __publicField$6(this, "give");
    this.patrons = /* @__PURE__ */ new Set();
    poolSets.set(this, this.patrons);
    let lastMicrotask = null;
    const doReceive = (value, options) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target, options);
      });
    };
    this.give = (value, options) => {
      const currentMicroTask = () => {
        if (currentMicroTask === lastMicrotask) {
          doReceive(value, options);
        }
      };
      lastMicrotask = currentMicroTask;
      queueMicrotask(currentMicroTask);
      return this;
    };
  }
  size() {
    return this.patrons.size;
  }
  add(shouldBePatron) {
    if (!shouldBePatron) {
      throw new Error("PatronPool add method received nothing!");
    }
    if (typeof shouldBePatron !== "function" && shouldBePatron.introduction && shouldBePatron.introduction() === "patron") {
      this.patrons.add(shouldBePatron);
    }
    return this;
  }
  remove(patron) {
    this.patrons.delete(patron);
    return this;
  }
  distribute(receiving, possiblePatron) {
    this.add(possiblePatron);
    this.sendValueToGuest(receiving, possiblePatron, {});
    return this;
  }
  sendValueToGuest(value, guest, options) {
    const isDisposed = this.guestDisposed(value, guest);
    if (!isDisposed) {
      give(value, guest, {
        ...options,
        data: {
          ...options?.data ?? {},
          initiator: this.initiator,
          pool: this
        }
      });
    }
  }
  guestDisposed(value, guest) {
    if (guest.disposed?.(value)) {
      this.remove(guest);
      return true;
    }
    return false;
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, key + "" , value);
class Source {
  constructor(sourceDocument) {
    this.sourceDocument = sourceDocument;
    __publicField$5(this, "thePool", new PatronPool(this));
  }
  pool() {
    return this.thePool;
  }
  give(value) {
    this.sourceDocument = value;
    this.thePool.give(this.sourceDocument);
    return this;
  }
  value(guest) {
    if (typeof guest === "function") {
      this.thePool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.thePool.distribute(this.sourceDocument, guest);
    }
    return this;
  }
}

class GuestObject {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
  }
  give(value, options) {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.give(value, options);
    return this;
  }
  introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }
  disposed(value) {
    const maybeDisposable = this.baseGuest;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestPool {
  constructor(initiator) {
    __publicField$4(this, "guests", /* @__PURE__ */ new Set());
    __publicField$4(this, "patronPool");
    this.patronPool = new PatronPool(initiator);
  }
  give(value, options) {
    this.deliverToGuests(value, options);
    this.patronPool.give(value, options);
    return this;
  }
  add(guest) {
    if (typeof guest === "function" || !guest.introduction || guest.introduction() === "guest") {
      this.guests.add(guest);
    }
    this.patronPool.add(guest);
    return this;
  }
  remove(patron) {
    this.guests.delete(patron);
    this.patronPool.remove(patron);
    return this;
  }
  distribute(receiving, possiblePatron) {
    this.add(possiblePatron);
    this.give(receiving);
    return this;
  }
  size() {
    return this.patronPool.size() + this.guests.size;
  }
  deliverToGuests(value, options) {
    this.guests.forEach((target) => {
      give(value, target, options);
    });
    this.guests.clear();
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestAwareAll {
  constructor() {
    __publicField$3(this, "theAll");
    __publicField$3(this, "keysKnown", /* @__PURE__ */ new Set());
    __publicField$3(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$3(this, "filledAllPool", new GuestPool(this));
    this.theAll = new Source({});
  }
  valueArray(guest) {
    const guestObject = new GuestObject(guest);
    this.filledAllPool.add(
      new GuestCast(guestObject, (value) => {
        guestObject.give(Object.values(value));
      })
    );
    if (this.isAllFilled()) {
      this.theAll.value(
        new Guest((all) => {
          this.filledAllPool.give(Object.values(all));
        })
      );
    }
    return this;
  }
  value(guest) {
    const guestObject = new GuestObject(guest);
    if (this.isAllFilled()) {
      this.filledAllPool.add(guestObject);
      this.theAll.value(
        new Guest((all) => {
          this.filledAllPool.give(all);
        })
      );
    } else {
      this.filledAllPool.add(guestObject);
    }
    return this;
  }
  guestKey(key) {
    this.keysKnown.add(key);
    return new Guest((value) => {
      queueMicrotask(() => {
        this.theAll.value(
          new Guest((all) => {
            this.keysFilled.add(key);
            const lastAll = {
              ...all,
              [key]: value
            };
            this.theAll.give(lastAll);
            if (this.isAllFilled()) {
              this.filledAllPool.give(lastAll);
            }
          })
        );
      });
    });
  }
  isAllFilled() {
    return this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
class SourceEmpty {
  constructor() {
    __publicField$2(this, "baseSource", new Source(null));
  }
  value(guest) {
    this.baseSource.value(
      new GuestCast(guest, (value) => {
        if (value !== null) {
          give(value, guest);
        }
      })
    );
    return this;
  }
  give(value) {
    this.baseSource.give(value);
    return this;
  }
  pool() {
    return this.baseSource.pool();
  }
}

class GuestAwareSequence {
  constructor(baseSource, targetSourceFactory) {
    this.baseSource = baseSource;
    this.targetSourceFactory = targetSourceFactory;
  }
  value(guest) {
    const all = new GuestAwareAll();
    const sequenceSource = new SourceEmpty();
    const targetSource = this.targetSourceFactory.create(
      sequenceSource
    );
    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        let index = 0;
        const nextItemHandle = () => {
          if (theValue[index + 1] !== void 0) {
            index = index + 1;
            handle();
          } else {
            all.valueArray(guest);
          }
        };
        function handle() {
          sequenceSource.give(theValue[index]);
          value(targetSource, all.guestKey(index.toString()));
          value(targetSource, nextItemHandle);
        }
        if (theValue[index] !== void 0) {
          handle();
        } else {
          give([], guest);
        }
      })
    );
    return this;
  }
}

class GuestAwareMap {
  constructor(baseSource, targetSourceFactory) {
    this.baseSource = baseSource;
    this.targetSourceFactory = targetSourceFactory;
  }
  value(guest) {
    const all = new GuestAwareAll();
    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        theValue.forEach((val, index) => {
          const targetSource = this.targetSourceFactory.create(
            new GuestAware((innerGuest) => {
              give(val, innerGuest);
            })
          );
          value(targetSource, all.guestKey(index.toString()));
        });
      })
    );
    all.valueArray(guest);
    return this;
  }
}

class GuestAwareRace {
  constructor(guestAwares) {
    this.guestAwares = guestAwares;
  }
  value(guest) {
    let connectedWithGuestAware = null;
    this.guestAwares.forEach((guestAware) => {
      value(
        guestAware,
        new GuestCast(guest, (value2) => {
          if (!connectedWithGuestAware || connectedWithGuestAware === guestAware) {
            give(value2, guest);
            connectedWithGuestAware = guestAware;
          }
        })
      );
    });
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
class GuestAwareActive {
  constructor(configExecutor) {
    this.configExecutor = configExecutor;
    __publicField$1(this, "source", new SourceEmpty());
  }
  do(config) {
    this.configExecutor(config, this.source);
    return this;
  }
  value(guest) {
    this.source.value(guest);
    return this;
  }
}

class GuestSync {
  constructor(theValue) {
    this.theValue = theValue;
  }
  give(value) {
    this.theValue = value;
    return this;
  }
  value() {
    return this.theValue;
  }
}

class GuestDisposable {
  constructor(guest, disposeCheck) {
    this.guest = guest;
    this.disposeCheck = disposeCheck;
  }
  disposed(value) {
    return this.disposeCheck(value);
  }
  give(value, options) {
    give(value, this.guest, options);
    return this;
  }
}

class Patron {
  constructor(willBePatron) {
    this.willBePatron = willBePatron;
  }
  introduction() {
    return "patron";
  }
  give(value, options) {
    give(value, this.willBePatron, options);
    return this;
  }
  disposed(value) {
    const maybeDisposable = this.willBePatron;
    return maybeDisposable?.disposed?.(value) || false;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class PatronOnce {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
    __publicField(this, "received", false);
  }
  introduction() {
    return "patron";
  }
  give(value, options) {
    if (!this.received) {
      give(value, this.baseGuest, options);
    }
    const data = options?.data;
    if (data?.pool) {
      data.pool.remove(this);
    }
    return this;
  }
  disposed(value) {
    const maybeDisposable = this.baseGuest;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}

class SourceDynamic {
  constructor(baseGuest, baseGuestAware) {
    this.baseGuest = baseGuest;
    this.baseGuestAware = baseGuestAware;
  }
  value(guest) {
    value(this.baseGuestAware, guest);
    return this;
  }
  give(value2) {
    give(value2, this.baseGuest);
    return this;
  }
  pool() {
    throw Error("No pool in SourceDynamic");
  }
}

class Factory {
  constructor(constructorFn, factories = {}) {
    this.constructorFn = constructorFn;
    this.factories = factories;
  }
  create(...args) {
    return new this.constructorFn(
      ...args,
      this.factories
    );
  }
}

class Module {
  constructor(buildingFn) {
    this.buildingFn = buildingFn;
  }
  create(...args) {
    return this.buildingFn(...args);
  }
}

export { Factory, Guest, GuestAware, GuestAwareActive, GuestAwareAll, GuestAwareMap, GuestAwareRace, GuestAwareSequence, GuestCast, GuestDisposable, GuestObject, GuestPool, GuestSync, Module, Patron, PatronOnce, PatronPool, Source, SourceDynamic, SourceEmpty, give, isPatronInPools, removePatronFromPools, value };
//# sourceMappingURL=patron.mjs.map
