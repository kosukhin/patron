'use strict';

function value(guestAware, guest) {
  if (guestAware === void 0) {
    throw new Error("value didnt receive guestAware argument");
  }
  if (guest === void 0) {
    throw new Error("value didnt receive guest argument");
  }
  if (typeof guestAware === "function") {
    return guestAware(guest);
  } else {
    return guestAware.value(guest);
  }
}
function isGuestAware(mbGuestAware) {
  if (mbGuestAware === void 0) {
    throw new Error("isGuestAware didnt receive mbGuestAware argument");
  }
  return typeof mbGuestAware === "function" || typeof mbGuestAware?.value === "function";
}
class GuestAware {
  constructor(guestAware) {
    this.guestAware = guestAware;
    if (guestAware === void 0) {
      throw new Error("GuestAware constructor didnt receive executor function");
    }
  }
  value(guest) {
    value(this.guestAware, guest);
    return guest;
  }
}

function give(data, guest, options) {
  if (data === void 0) {
    throw new Error("give didnt receive data argument");
  }
  if (guest === void 0) {
    throw new Error("give didnt receive guest argument");
  }
  if (typeof guest === "function") {
    guest(data, options);
  } else {
    guest.give(data, options);
  }
}
function isGuest(mbGuest) {
  if (mbGuest === void 0) {
    throw new Error("isGuest didnt receive mbGuest argument");
  }
  return typeof mbGuest === "function" || typeof mbGuest?.give === "function";
}
class Guest {
  constructor(receiver) {
    this.receiver = receiver;
    if (!receiver) {
      throw new Error("reseiver function was not passed to Guest constructor");
    }
  }
  give(value, options) {
    this.receiver(value, options);
    return this;
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, key + "" , value);
class PatronOnce {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
    __publicField$6(this, "received", false);
    if (baseGuest === void 0) {
      throw new Error("PatronOnce didnt receive baseGuest argument");
    }
  }
  introduction() {
    return "patron";
  }
  give(value, options) {
    if (!this.received) {
      this.received = true;
      give(value, this.baseGuest, options);
    }
    return this;
  }
  disposed(value) {
    if (this.received) {
      return true;
    }
    const maybeDisposable = this.baseGuest;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}

class GuestCast {
  constructor(sourceGuest, targetGuest) {
    this.sourceGuest = sourceGuest;
    this.targetGuest = targetGuest;
    if (sourceGuest === void 0) {
      throw new Error("GuestCast didnt receive sourceGuest argument");
    }
    if (targetGuest === void 0) {
      throw new Error("GuestCast didnt receive targetGuest argument");
    }
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
    give(value, this.targetGuest, {
      ...options,
      data: {
        ...options?.data ?? {},
        castedGuest: options?.data?.castedGuest ?? this
      }
    });
    return this;
  }
  disposed(value) {
    const maybeDisposable = this.sourceGuest;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
const poolSets = /* @__PURE__ */ new Map();
const removePatronFromPools = (patron) => {
  if (patron === void 0) {
    throw new Error("removePatronFromPools didnt receive patron argument");
  }
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};
const isPatronInPools = (patron) => {
  if (patron === void 0) {
    throw new Error("isPatronInPools didnt receive patron argument");
  }
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
    __publicField$5(this, "patrons");
    __publicField$5(this, "give");
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

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, key + "" , value);
class Source {
  constructor(sourceDocument) {
    this.sourceDocument = sourceDocument;
    __publicField$4(this, "thePool", new PatronPool(this));
    if (sourceDocument === void 0) {
      throw new Error("Source didnt receive sourceDocument argument");
    }
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

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
class SourceEmpty {
  constructor() {
    __publicField$3(this, "baseSource", new Source(null));
  }
  value(guest) {
    this.baseSource.value(
      new GuestCast(guest, (value, options) => {
        if (value !== null) {
          give(value, guest, options);
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

class GuestObject {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
    if (baseGuest === void 0) {
      throw new Error("GuestObject didnt receive baseGuest argument");
    }
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

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestPool {
  constructor(initiator) {
    __publicField$2(this, "guests", /* @__PURE__ */ new Set());
    __publicField$2(this, "patronPool");
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

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestAwareAll {
  constructor() {
    __publicField$1(this, "theAll");
    __publicField$1(this, "keysKnown", /* @__PURE__ */ new Set());
    __publicField$1(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$1(this, "filledAllPool", new GuestPool(this));
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

class GuestAwareSequence {
  constructor(baseSource, targetSource) {
    this.baseSource = baseSource;
    this.targetSource = targetSource;
    if (baseSource === void 0) {
      throw new Error("GuestAwareSequence didnt receive baseSource argument");
    }
    if (targetSource === void 0) {
      throw new Error("GuestAwareSequence didnt receive targetSource argument");
    }
  }
  value(guest) {
    const all = new GuestAwareAll();
    const sequenceSource = new SourceEmpty();
    const targetSource = this.targetSource.get(sequenceSource);
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
          sequenceSource.give(null);
          const nextValue = theValue[index];
          if (isGuestAware(nextValue)) {
            value(
              nextValue,
              new PatronOnce((theNextValue) => {
                sequenceSource.give(theNextValue);
                value(targetSource, all.guestKey(index.toString()));
                nextItemHandle();
              })
            );
          } else {
            sequenceSource.give(nextValue);
            value(targetSource, all.guestKey(index.toString()));
            nextItemHandle();
          }
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
  constructor(baseSource, targetSource) {
    this.baseSource = baseSource;
    this.targetSource = targetSource;
    if (baseSource === void 0) {
      throw new Error("GuestAwareMap didnt receive baseSource argument");
    }
    if (targetSource === void 0) {
      throw new Error("GuestAwareMap didnt receive targetSource argument");
    }
  }
  value(guest) {
    const all = new GuestAwareAll();
    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        theValue.forEach((val, index) => {
          const valueSource = isGuestAware(val) ? val : new GuestAware((innerGuest) => {
            give(val, innerGuest);
          });
          const targetSource = this.targetSource.get(valueSource);
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
    if (guestAwares === void 0) {
      throw new Error("GuestAwareRace didnt receive guestAwares argument");
    }
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class GuestAwareActive {
  constructor(configExecutor) {
    this.configExecutor = configExecutor;
    __publicField(this, "source", new SourceEmpty());
    if (configExecutor === void 0) {
      throw new Error(
        "GuestAwareActive constructor didnt receive executor function"
      );
    }
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
    if (theValue === void 0) {
      throw new Error("GuestSync didnt receive theValue argument");
    }
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
    if (guest === void 0) {
      throw new Error("GuestDisposable didnt receive guest argument");
    }
    if (disposeCheck === void 0) {
      throw new Error("GuestDisposable didnt receive disposeCheck argument");
    }
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
    if (willBePatron === void 0) {
      throw new Error("Patron didnt receive willBePatron argument");
    }
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

class SourceDynamic {
  constructor(baseGuest, baseGuestAware) {
    this.baseGuest = baseGuest;
    this.baseGuestAware = baseGuestAware;
    if (baseGuest === void 0) {
      throw new Error("SourceDynamic didnt receive baseGuest argument");
    }
    if (baseGuestAware === void 0) {
      throw new Error("SourceDynamic didnt receive baseGuestAware argument");
    }
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

class PrivateClass {
  constructor(constructorFn, modules = {}) {
    this.constructorFn = constructorFn;
    this.modules = modules;
    if (constructorFn === void 0) {
      throw new Error("PrivateClass didnt receive constructorFn argument");
    }
  }
  get(...args) {
    return new this.constructorFn(
      ...args,
      this.modules
    );
  }
}

class Private {
  constructor(buildingFn) {
    this.buildingFn = buildingFn;
    if (buildingFn === void 0) {
      throw new Error("Private didnt receive buildingFn argument");
    }
  }
  get(...args) {
    return this.buildingFn(...args);
  }
}

exports.Guest = Guest;
exports.GuestAware = GuestAware;
exports.GuestAwareActive = GuestAwareActive;
exports.GuestAwareAll = GuestAwareAll;
exports.GuestAwareMap = GuestAwareMap;
exports.GuestAwareRace = GuestAwareRace;
exports.GuestAwareSequence = GuestAwareSequence;
exports.GuestCast = GuestCast;
exports.GuestDisposable = GuestDisposable;
exports.GuestObject = GuestObject;
exports.GuestPool = GuestPool;
exports.GuestSync = GuestSync;
exports.Patron = Patron;
exports.PatronOnce = PatronOnce;
exports.PatronPool = PatronPool;
exports.Private = Private;
exports.PrivateClass = PrivateClass;
exports.Source = Source;
exports.SourceDynamic = SourceDynamic;
exports.SourceEmpty = SourceEmpty;
exports.give = give;
exports.isGuest = isGuest;
exports.isGuestAware = isGuestAware;
exports.isPatronInPools = isPatronInPools;
exports.removePatronFromPools = removePatronFromPools;
exports.value = value;
//# sourceMappingURL=patron.cjs.map
