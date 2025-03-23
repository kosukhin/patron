import { SourceDynamic } from "./SourceDynamic";
import { SourceWithPool } from "./SourceWithPool";
import { expect, test } from "vitest";

test("SourceDynamic.ofSource.test", () => {
  const source = new SourceWithPool(1);
  const sourceDynamic = new SourceDynamic(source, source);

  sourceDynamic.value((value) => {
    expect(value).toBe(1);
  });

  sourceDynamic.give(2);

  sourceDynamic.value((value) => {
    expect(value).toBe(2);
  });
  source.value((value) => {
    expect(value).toBe(2);
  });
});
