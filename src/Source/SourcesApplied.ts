export class SourcesApplied<T> {
  constructor(target: T, methodsSources: Record<string, unknown[]>) {
    return Object.fromEntries(
      Object.entries(target).reduce(([key, value]) => {
        if (value instanceof Function) {
          return [
            key,
            new Proxy(value, {
              apply(target: Function, thisArg: any, argArray: any[]): any {
                return target.apply(thisArg, argArray);
              },
            }),
          ];
        }

        return [key, value];
      }),
    ) as SourcesApplied<T>;
  }
}
