import { PrivateType } from "./Private";

interface Constructable<T> {
  new (...args: unknown[]): T;
}

interface Prototyped<T> {
  prototype: T;
}

export class PrivateClass<T> implements PrivateType<T> {
  public constructor(
    private constructorFn: Prototyped<T>,
    private modules: Record<string, unknown> = {},
  ) {
    if (constructorFn === undefined) {
      throw new Error("PrivateClass didnt receive constructorFn argument");
    }
  }

  public get<R extends unknown[], CT = null>(
    ...args: R
  ): CT extends null ? T : CT {
    return new (this.constructorFn as Constructable<T>)(
      ...args,
      this.modules,
    ) as CT extends null ? T : CT;
  }
}
