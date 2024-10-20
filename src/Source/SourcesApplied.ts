type TupleSplit<
  T,
  N extends number,
  O extends readonly any[] = readonly [],
> = O["length"] extends N
  ? [O, T]
  : T extends readonly [infer F, ...infer R]
    ? TupleSplit<readonly [...R], N, readonly [...O, F]>
    : [O, T];

type SkipFirst<T extends readonly any[], N extends number> = TupleSplit<
  T,
  N
>[1];

export const sourcesApplied = <T>(
  target: T,
  methodsSources: Record<string, unknown[]>,
) => {
  return Object.fromEntries(
    Object.entries(target as object).map(([key, value]) => {
      if (value instanceof Function && methodsSources[key]) {
        const methodArgs = methodsSources[key];
        return [
          key,
          new Proxy(value, {
            apply(target: Function, thisArg: any, argArray: any[]): any {
              return target.apply(thisArg, [
                ...methodsSources[key],
                ...argArray,
              ]);
            },
          }) as (...args: Parameters<typeof value>) => ReturnType<typeof value>,
        ];
      }

      return [key, value];
    }),
  );
};
