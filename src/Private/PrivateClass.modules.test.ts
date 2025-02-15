import { PrivateClass } from "./PrivateClass";
import { GuestType } from "../Guest/Guest";
import { Source, SourceType } from "../Source/Source";
import { expect, test } from "vitest";
import { PrivateType } from "./Private";

class TestClass {
  private source: SourceType;

  public constructor(
    baseNum: number,
    modules: { main: PrivateType<SourceType> },
  ) {
    this.source = modules.main.get(baseNum + 55);
  }

  public value(guest: GuestType) {
    this.source.value(guest);
    return this;
  }
}

test("PrivateClass.modules.test", () => {
  const main = new PrivateClass(Source);
  const testSource = new PrivateClass(TestClass, {
     main,
  });

  const source = testSource.get(42);
  source.value((value) => {
    expect(value).toBe(97);
  });
});
