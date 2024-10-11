import { FactoryType } from './FactoryType';

interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface Prototyped<T> {
  prototype: T
}

export class FactoryWithFactories<T> implements FactoryType<T> {
  public constructor(
    private constructorFn: Prototyped<T>,
    private factories: Record<string, unknown> = {},
  ) {}

  public create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT {
    // eslint-disable-next-line new-cap
    return new (this.constructorFn as Constructable<T>)(...args, this.factories) as CT extends null ? T : CT;
  }
}
