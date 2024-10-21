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
  return new Proxy(target as object, {
    get: function (target: any, property) {
      const maybeMethod = target[property];

      if (typeof maybeMethod !== "function") {
        return maybeMethod;
      }

      return (...args: any[]) => {
        const appliedArgs = (methodsSources as any)[property];

        if (appliedArgs) {
          return maybeMethod(...appliedArgs, ...args);
        }

        return maybeMethod(...args);
      };
    },
  });
};
