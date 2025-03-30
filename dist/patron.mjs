function give(data, guest) {
  if (data === void 0) {
    throw new Error("give didnt receive data argument");
  }
  if (guest === void 0) {
    throw new Error("give didnt receive guest argument");
  }
  if (typeof guest === "function") {
    guest(data);
  } else {
    guest.give(data);
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
  give(value) {
    this.receiver(value);
    return this;
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
  give(value) {
    give(value, this.targetGuest);
    return this;
  }
  disposed(value) {
    const maybeDisposable = this.sourceGuest;
    return maybeDisposable.disposed ? maybeDisposable.disposed(value) : false;
  }
}

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
const poolSets = /* @__PURE__ */ new Map();
const patronPools = (patron) => {
  const pools = [];
  poolSets.forEach((pool, poolInstance) => {
    if (pool.has(patron)) {
      pools.push(poolInstance);
    }
  });
  return pools;
};
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
    __publicField$a(this, "patrons");
    __publicField$a(this, "give");
    this.patrons = /* @__PURE__ */ new Set();
    poolSets.set(this, this.patrons);
    const doReceive = (value) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target);
      });
    };
    this.give = (value) => {
      doReceive(value);
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
    this.sendValueToGuest(receiving, possiblePatron);
    return this;
  }
  sendValueToGuest(value, guest) {
    const isDisposed = this.guestDisposed(value, guest);
    if (!isDisposed) {
      give(value, guest);
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

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestPool {
  constructor(initiator) {
    __publicField$9(this, "guests", /* @__PURE__ */ new Set());
    __publicField$9(this, "patronPool");
    this.patronPool = new PatronPool(initiator);
  }
  give(value) {
    this.deliverToGuests(value);
    this.patronPool.give(value);
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
  deliverToGuests(value) {
    this.guests.forEach((target) => {
      give(value, target);
    });
    this.guests.clear();
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

class GuestObject {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
    if (baseGuest === void 0) {
      throw new Error("GuestObject didnt receive baseGuest argument");
    }
  }
  give(value) {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.give(value);
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
  give(value) {
    give(value, this.guest);
    return this;
  }
}

class GuestApplied {
  constructor(baseGuest, applier) {
    this.baseGuest = baseGuest;
    this.applier = applier;
  }
  give(value) {
    give(this.applier(value), this.baseGuest);
    return this;
  }
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, key + "" , value);
class GuestExecutorApplied {
  constructor(baseGuest, applier) {
    __publicField$8(this, "give");
    this.give = applier((v) => give(v, baseGuest));
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
  give(value) {
    give(value, this.willBePatron);
    return this;
  }
  disposed(value) {
    const maybeDisposable = this.willBePatron;
    return maybeDisposable?.disposed?.(value) || false;
  }
}
const isPatron = (guest) => typeof guest === "object" && guest !== null && guest?.introduction?.() === "patron";

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, key + "" , value);
class PatronOnce {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
    __publicField$7(this, "received", false);
    if (baseGuest === void 0) {
      throw new Error("PatronOnce didnt receive baseGuest argument");
    }
  }
  introduction() {
    return "patron";
  }
  give(value) {
    if (!this.received) {
      this.received = true;
      give(value, this.baseGuest);
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

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, key + "" , value);
class PatronApplied {
  constructor(baseGuest, applier) {
    __publicField$6(this, "guestApplied");
    this.guestApplied = new GuestApplied(baseGuest, applier);
  }
  give(value) {
    this.guestApplied.give(value);
    return this;
  }
  introduction() {
    return "patron";
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, key + "" , value);
class PatronExecutorApplied {
  constructor(baseGuest, applier) {
    __publicField$5(this, "guestApplied");
    this.guestApplied = new GuestExecutorApplied(baseGuest, applier);
  }
  give(value) {
    this.guestApplied.give(value);
    return this;
  }
  introduction() {
    return "patron";
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
class SourceWithPool {
  constructor(sourceDocument) {
    this.sourceDocument = sourceDocument;
    __publicField$4(this, "thePool", new PatronPool(this));
    __publicField$4(this, "theEmptyPool", new PatronPool(this));
    __publicField$4(this, "isEmpty");
    this.isEmpty = sourceDocument === void 0;
  }
  pool() {
    return this.thePool;
  }
  give(value) {
    this.isEmpty = false;
    this.sourceDocument = value;
    this.thePool.give(this.sourceDocument);
    this.theEmptyPool.give(this.sourceDocument);
    return this;
  }
  value(guest) {
    if (this.isEmpty) {
      if (isPatron(guest)) {
        this.theEmptyPool.add(guest);
      }
      return this;
    }
    if (typeof guest === "function") {
      this.thePool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.thePool.distribute(this.sourceDocument, guest);
    }
    return this;
  }
  filled() {
    return !this.isEmpty;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class SourceAll {
  constructor(initialKnownKeys = []) {
    __publicField$3(this, "theAll");
    __publicField$3(this, "keysKnown");
    __publicField$3(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$3(this, "filledAllPool", new GuestPool(this));
    this.theAll = new SourceWithPool({});
    this.keysKnown = new Set(initialKnownKeys);
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
  }
  isAllFilled() {
    return this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size;
  }
}

function value(source, guest) {
  if (source === void 0) {
    throw new Error("value didnt receive source argument");
  }
  if (guest === void 0) {
    throw new Error("value didnt receive guest argument");
  }
  if (typeof source === "function") {
    return source(guest);
  } else {
    return source.value(guest);
  }
}
function isSource(mbSource) {
  if (mbSource === void 0) {
    throw new Error("isSource didnt receive mbSource argument");
  }
  return typeof mbSource === "function" || typeof mbSource?.value === "function";
}
class Source {
  constructor(source) {
    this.source = source;
    if (source === void 0) {
      throw new Error("Source constructor didnt receive executor function");
    }
  }
  value(guest) {
    value(this.source, guest);
    return guest;
  }
}
const sourceOf = (value2) => new Source((g) => give(value2, g));

class SourceSequence {
  constructor(baseSource, targetSource) {
    this.baseSource = baseSource;
    this.targetSource = targetSource;
    if (baseSource === void 0) {
      throw new Error("SourceSequence didnt receive baseSource argument");
    }
    if (targetSource === void 0) {
      throw new Error("SourceSequence didnt receive targetSource argument");
    }
  }
  value(guest) {
    const all = new SourceAll();
    const sequenceSource = new SourceWithPool();
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
          if (isSource(nextValue)) {
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

class SourceMap {
  constructor(baseSource, targetSource) {
    this.baseSource = baseSource;
    this.targetSource = targetSource;
    if (baseSource === void 0) {
      throw new Error("SourceMap didnt receive baseSource argument");
    }
    if (targetSource === void 0) {
      throw new Error("SourceMap didnt receive targetSource argument");
    }
  }
  value(guest) {
    const all = new SourceAll();
    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        theValue.forEach((val, index) => {
          const valueSource = isSource(val) ? val : new Source((innerGuest) => {
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

class SourceRace {
  constructor(sources) {
    this.sources = sources;
    if (sources === void 0) {
      throw new Error("SourceRace didnt receive sources argument");
    }
  }
  value(guest) {
    let connectedWithSource = null;
    this.sources.forEach((source) => {
      value(
        source,
        new GuestCast(guest, (value2) => {
          if (!connectedWithSource || connectedWithSource === source) {
            give(value2, guest);
            connectedWithSource = source;
          }
        })
      );
    });
    return this;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
class SourceActive {
  constructor(configExecutor) {
    this.configExecutor = configExecutor;
    __publicField$2(this, "source", new SourceWithPool());
    if (configExecutor === void 0) {
      throw new Error(
        "SourceActive constructor didnt receive executor function"
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

class SourceDynamic {
  constructor(baseGuest, baseSource) {
    this.baseGuest = baseGuest;
    this.baseSource = baseSource;
    if (baseGuest === void 0) {
      throw new Error("SourceDynamic didnt receive baseGuest argument");
    }
    if (baseSource === void 0) {
      throw new Error("SourceDynamic didnt receive baseSource argument");
    }
  }
  value(guest) {
    value(this.baseSource, guest);
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

class SourceApplied {
  constructor(baseSource, applier) {
    this.baseSource = baseSource;
    this.applier = applier;
  }
  value(g) {
    value(
      this.baseSource,
      new GuestCast(g, (v) => {
        give(this.applier(v), g);
      })
    );
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value2) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField$1 = (obj, key, value2) => __defNormalProp$1(obj, key + "" , value2);
class SourceExecutorApplied {
  constructor(source, applier) {
    __publicField$1(this, "value");
    this.value = applier((g) => {
      value(source, g);
    });
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField = (obj, key, value2) => __defNormalProp(obj, key + "" , value2);
class SourceOnce {
  constructor(initialValue) {
    __publicField(this, "source");
    this.source = new SourceWithPool(initialValue);
  }
  value(guest) {
    value(this.source, guest);
    return this;
  }
  give(value2) {
    if (!this.source.filled()) {
      this.source.give(value2);
    }
    return this;
  }
  pool() {
    return this.source.pool();
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

export { Guest, GuestApplied, GuestCast, GuestDisposable, GuestExecutorApplied, GuestObject, GuestPool, GuestSync, Patron, PatronApplied, PatronExecutorApplied, PatronOnce, PatronPool, Private, PrivateClass, Source, SourceActive, SourceAll, SourceApplied, SourceDynamic, SourceExecutorApplied, SourceMap, SourceOnce, SourceRace, SourceSequence, SourceWithPool, give, isGuest, isPatron, isPatronInPools, isSource, patronPools, removePatronFromPools, sourceOf, value };
//# sourceMappingURL=patron.mjs.map
