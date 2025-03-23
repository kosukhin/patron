import { SourceDynamic } from "./SourceDynamic";
import { SourceWithPool } from "./SourceWithPool";
import { expect, test, vitest } from "vitest";

test("SourceDynamic.ofSource.test", () => {
  const source = new SourceWithPool(1);
  const sourceDynamic = new SourceDynamic(source, source);

  const g1 = vitest.fn();
  sourceDynamic.value(g1);
  expect(g1).toBeCalledWith(1);

  sourceDynamic.give(2);

  const g2 = vitest.fn();
  sourceDynamic.value(g2);
  expect(g2).toBeCalledWith(2);
  const g3 = vitest.fn();
  source.value(g3);
  expect(g3).toBeCalledWith(2);
});
