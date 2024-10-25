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

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
const poolSets = /* @__PURE__ */ new Map();
const removePatronFromPools = (patron) => {
  poolSets.forEach((pool) => {
    pool.delete(patron);
  });
};
class PatronPool {
  constructor(initiator) {
    this.initiator = initiator;
    __publicField$4(this, "patrons", /* @__PURE__ */ new Set());
    __publicField$4(this, "receive");
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

class GuestAware {
  constructor(guestReceiver) {
    this.guestReceiver = guestReceiver;
  }
  receiving(guest) {
    this.guestReceiver(guest);
    return guest;
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

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestPool {
  constructor(initiator) {
    __publicField$3(this, "guests", /* @__PURE__ */ new Set());
    __publicField$3(this, "patronPool");
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

class GuestInTheMiddle {
  constructor(baseGuest, middleFn) {
    this.baseGuest = baseGuest;
    this.middleFn = middleFn;
  }
  introduction() {
    if (!this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }
  receive(value, options) {
    this.middleFn(value, options);
    return this;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
class SourceOfValue {
  constructor(sourceDocument) {
    this.sourceDocument = sourceDocument;
    __publicField$2(this, "pool", new PatronPool(this));
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

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class GuestChain {
  constructor() {
    __publicField$1(this, "theChain");
    __publicField$1(this, "keysKnown", /* @__PURE__ */ new Set());
    __publicField$1(this, "keysFilled", /* @__PURE__ */ new Set());
    __publicField$1(this, "filledChainPool", new GuestPool(this));
    this.theChain = new SourceOfValue({});
  }
  resultArray(guest) {
    this.filledChainPool.add(
      new GuestInTheMiddle(
        guest,
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
    if (this.isChainFilled()) {
      this.filledChainPool.add(guest);
      this.theChain.receiving(
        new Guest((chain) => {
          this.filledChainPool.receive(chain);
        })
      );
    } else {
      this.filledChainPool.add(guest);
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

if (globalThis) {
  globalThis["GUEST_LIBRARY"] = {
    give,
    removePatronFromPools,
    GuestAware,
    Guest,
    GuestCast,
    GuestChain,
    GuestInTheMiddle,
    GuestPool,
    GuestSync,
    Patron,
    PatronOnce,
    PatronPool,
    SourceOfValue
  };
}

export { Guest, GuestAware, GuestCast, GuestChain, GuestInTheMiddle, GuestPool, GuestSync, Patron, PatronOnce, PatronPool, SourceOfValue, give, removePatronFromPools };
//# sourceMappingURL=patron.mjs.map
