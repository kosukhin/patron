import { PrivateClass } from "./PrivateClass";
import { GuestType } from "../Guest/Guest";
import { SourceWithPool, SourceWithPoolType } from "../Source/SourceWithPool";
import { expect, test } from "vitest";
import { PrivateType } from "./Private";

class TestClass {
  private source: SourceWithPoolType;

  public constructor(
    baseNum: number,
    modules: { main: PrivateType<SourceWithPoolType> },
  ) {
    this.source = modules.main.get(baseNum + 55);
  }

  public value(guest: GuestType) {
    this.source.value(guest);
    return this;
  }
}

test("PrivateClass.modules.test", () => {
  const main = new PrivateClass(SourceWithPool);
  const testSource = new PrivateClass(TestClass, {
    main,
  });

  const source = testSource.get(42);
  source.value((value) => {
    expect(value).toBe(97);
  });
});
