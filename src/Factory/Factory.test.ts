import { Factory, FactoryType } from "src/Factory/Factory";
import { GuestType } from "src/Guest/Guest";
import { Source, SourceType } from "src/Source/Source";
import { expect, test } from "vitest";

test("factory", () => {
  const sourceFactory = new Factory(Source);
  const source = sourceFactory.create(42);

  source.value((value) => {
    expect(value).toBe(42);
  });
});

class TestFactory {
  private source: SourceType;

  public constructor(
    baseNum: number,
    private factories: { mainFactory: FactoryType<SourceType> },
  ) {
    this.source = factories.mainFactory.create(baseNum + 55);
  }

  public value(guest: GuestType) {
    this.source.value(guest);
    return this;
  }
}

test("factory with factories", () => {
  const mainFactory = new Factory(Source);
  const sourceFactory = new Factory(TestFactory, {
    mainFactory,
  });

  const source = sourceFactory.create(42);

  source.value((value) => {
    expect(value).toBe(97);
  });
});
