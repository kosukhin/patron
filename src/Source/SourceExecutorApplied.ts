import {
  SourceExecutorType,
  SourceObjectType,
  SourceType,
  value,
} from "../Source/Source";

/**
 * @url https://kosukhin.github.io/patron.site/#/source/source-executor-applied
 */
export class SourceExecutorApplied<T> implements SourceObjectType<T> {
  public value: SourceExecutorType<T>;

  public constructor(
    source: SourceType<T>,
    applier: (executor: SourceExecutorType<T>) => SourceExecutorType<T>,
  ) {
    this.value = applier((g) => {
      value(source, g);
    });
  }
}
