class GuestAware {
  constructor(guestReceiver) {
    this.guestReceiver = guestReceiver;
  }
  value(guest) {
    this.guestReceiver(guest);
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

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
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

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestPool {
  constructor(initiator) {
    __publicField$3(this, "guests", /* @__PURE__ */ new Set());
    __publicField$3(this, "patronPool");
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

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestChain {
  constructor() {
    __publicField$2(this, "theChain");
    __publicField$2(this, "keysKnown", /* @__PURE__ */ new Set());
    __publicField$2(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$2(this, "filledChainPool", new GuestPool(this));
    this.theChain = new Source({});
  }
  resultArray(guest) {
    const guestObject = new GuestObject(guest);
    this.filledChainPool.add(
      new GuestCast(guestObject, (value) => {
        guestObject.give(Object.values(value));
      })
    );
    if (this.isChainFilled()) {
      this.theChain.value(
        new Guest((chain) => {
          this.filledChainPool.give(Object.values(chain));
        })
      );
    }
    return this;
  }
  result(guest) {
    const guestObject = new GuestObject(guest);
    if (this.isChainFilled()) {
      this.filledChainPool.add(guestObject);
      this.theChain.value(
        new Guest((chain) => {
          this.filledChainPool.give(chain);
        })
      );
    } else {
      this.filledChainPool.add(guestObject);
    }
    return this;
  }
  receiveKey(key) {
    this.keysKnown.add(key);
    return new Guest((value) => {
      queueMicrotask(() => {
        this.theChain.value(
          new Guest((chain) => {
            this.keysFilled.add(key);
            const lastChain = {
              ...chain,
              [key]: value
            };
            this.theChain.give(lastChain);
            if (this.isChainFilled()) {
              this.filledChainPool.give(lastChain);
            }
          })
        );
      });
    });
  }
  isChainFilled() {
    return this.keysFilled.size > 0 && this.keysFilled.size === this.keysKnown.size;
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

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
class PatronOnce {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
    __publicField$1(this, "received", false);
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class SourceEmpty {
  constructor() {
    __publicField(this, "baseSource", new Source(null));
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

export { Factory, Guest, GuestAware, GuestCast, GuestChain, GuestDisposable, GuestObject, GuestPool, GuestSync, Module, Patron, PatronOnce, PatronPool, Source, SourceEmpty, give, isPatronInPools, removePatronFromPools };
//# sourceMappingURL=patron.js.map
