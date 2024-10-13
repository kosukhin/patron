import { FactoryType } from "./Factory";

export class FactoryDynamic<T> implements FactoryType<T> {
  public constructor(private creationFn: (...args: unknown[]) => T) {}

  public create<R extends unknown[], CT = null>(
    ...args: R
  ): CT extends null ? T : CT {
    return this.creationFn(...args) as CT extends null ? T : CT;
  }
}
