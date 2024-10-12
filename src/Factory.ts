import { FactoryType } from "./FactoryType";

interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface Prototyped<T> {
  prototype: T;
}

export class Factory<T> implements FactoryType<T> {
  public constructor(private constructorFn: Prototyped<T>) {}

  public create<R extends unknown[], CT = null>(
    ...args: R
  ): CT extends null ? T : CT {
    return new (this.constructorFn as Constructable<T>)(
      ...args,
    ) as CT extends null ? T : CT;
  }
}
