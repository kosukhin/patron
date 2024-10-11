export interface FactoryType<T> {
  create<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}
