import { FactoryType } from './FactoryType';

export class FactoryDynamic<T> implements FactoryType<T> {
  public constructor(
    private creationFn: (...args: any[]) => T,
  ) {}

  public create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT {
    return this.creationFn(...args) as CT extends null ? T : CT;
  }
}
