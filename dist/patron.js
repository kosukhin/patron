'use strict';

class GuestAware {
  constructor(guestReceiver) {
    this.guestReceiver = guestReceiver;
  }
  receiving(guest) {
    this.guestReceiver(guest);
    return guest;
  }
}

function give(data, guest, options) {
  if (typeof guest === "function") {
    guest(data, options);
  } else {
    guest.receive(data, options);
  }
}
class Guest {
  constructor(receiver) {
    this.receiver = receiver;
  }
  receive(value, options) {
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
  receive(value, options) {
    give(value, this.targetGuest, options);
    return this;
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
class PatronPool {
  constructor(initiator) {
    this.initiator = initiator;
    __publicField$5(this, "patrons", /* @__PURE__ */ new Set());
    __publicField$5(this, "receive");
    poolSets.set(this, this.patrons);
    let lastMicrotask = null;
    const doReceive = (value, options) => {
      this.patrons.forEach((target) => {
        this.sendValueToGuest(value, target, options);
      });
    };
    this.receive = (value, options) => {
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
  add(shouldBePatron) {
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

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestPool {
  constructor(initiator) {
    __publicField$4(this, "guests", /* @__PURE__ */ new Set());
    __publicField$4(this, "patronPool");
    this.patronPool = new PatronPool(initiator);
  }
  receive(value, options) {
    this.deliverToGuests(value, options);
    this.patronPool.receive(value, options);
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
    this.receive(receiving);
    return this;
  }
  deliverToGuests(value, options) {
    this.guests.forEach((target) => {
      give(value, target, options);
    });
    this.guests.clear();
  }
}

class GuestMiddle {
  constructor(baseGuest, middleFn) {
    this.baseGuest = baseGuest;
    this.middleFn = middleFn;
  }
  introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }
  receive(value, options) {
    this.middleFn(value, options);
    return this;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
class Source {
  constructor(sourceDocument) {
    this.sourceDocument = sourceDocument;
    __publicField$3(this, "pool", new PatronPool(this));
  }
  receive(value) {
    this.sourceDocument = value;
    this.pool.receive(this.sourceDocument);
    return this;
  }
  receiving(guest) {
    if (typeof guest === "function") {
      this.pool.distribute(this.sourceDocument, new Guest(guest));
    } else {
      this.pool.distribute(this.sourceDocument, guest);
    }
    return this;
  }
}

class GuestObject {
  constructor(baseGuest) {
    this.baseGuest = baseGuest;
  }
  receive(value, options) {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.receive(value, options);
    return this;
  }
  introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
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
      new GuestMiddle(
        guestObject,
        (value) => Object.values(value)
      )
    );
    if (this.isChainFilled()) {
      this.theChain.receiving(
        new Guest((chain) => {
          this.filledChainPool.receive(Object.values(chain));
        })
      );
    }
    return this;
  }
  result(guest) {
    const guestObject = new GuestObject(guest);
    if (this.isChainFilled()) {
      this.filledChainPool.add(guestObject);
      this.theChain.receiving(
        new Guest((chain) => {
          this.filledChainPool.receive(chain);
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
        this.theChain.receiving(
          new Guest((chain) => {
            this.keysFilled.add(key);
            const lastChain = {
              ...chain,
              [key]: value
            };
            this.theChain.receive(lastChain);
            if (this.isChainFilled()) {
              this.filledChainPool.receive(lastChain);
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
  receive(value) {
    this.theValue = value;
    return this;
  }
  value() {
    return this.theValue;
  }
}

class Patron {
  constructor(willBePatron) {
    this.willBePatron = willBePatron;
  }
  introduction() {
    return "patron";
  }
  receive(value, options) {
    give(value, this.willBePatron, options);
    return this;
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
  receive(value, options) {
    if (!this.received) {
      give(value, this.baseGuest, options);
    }
    const data = options?.data;
    if (data?.pool) {
      data.pool.remove(this);
    }
    return this;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class SourceEmpty {
  constructor() {
    __publicField(this, "baseSource", new Source(null));
  }
  receiving(guest) {
    this.baseSource.receiving(
      new GuestMiddle(guest, (value) => {
        if (value !== null) {
          give(value, guest);
        }
      })
    );
    return this;
  }
  receive(value) {
    this.baseSource.receive(value);
    return this;
  }
}

class Factory {
  constructor(constructorFn, factories = {}) {
    this.constructorFn = constructorFn;
    this.factories = factories;
  }
  create(...args) {
    return new this.constructorFn(...args, this.factories);
  }
}

exports.Factory = Factory;
exports.Guest = Guest;
exports.GuestAware = GuestAware;
exports.GuestCast = GuestCast;
exports.GuestChain = GuestChain;
exports.GuestMiddle = GuestMiddle;
exports.GuestObject = GuestObject;
exports.GuestPool = GuestPool;
exports.GuestSync = GuestSync;
exports.Patron = Patron;
exports.PatronOnce = PatronOnce;
exports.PatronPool = PatronPool;
exports.Source = Source;
exports.SourceEmpty = SourceEmpty;
exports.give = give;
exports.removePatronFromPools = removePatronFromPools;
//# sourceMappingURL=patron.js.map
