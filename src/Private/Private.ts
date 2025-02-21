/**
 * @url https://kosukhin.github.io/patron.site/#/utils/private
 */
export interface PrivateType<T> {
  get<R extends unknown[], CT = null>(...args: R): CT extends null ? T : CT;
}

export class Private<T> implements PrivateType<T> {
  public constructor(private buildingFn: (...args: any[]) => T) {
    if (buildingFn === undefined) {
      throw new Error("Private didnt receive buildingFn argument");
    }
  }

  public get<R extends unknown[], CT = null>(
    ...args: R
  ): CT extends null ? T : CT {
    return this.buildingFn(...args) as CT extends null ? T : CT;
  }
}
