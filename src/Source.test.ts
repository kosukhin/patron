import { expect, test } from 'vitest';
import { Source } from './Source';
import { Guest } from './Guest';

test('source', () => {
  const source = new Source(42);

  source.receiving(new Guest((value) => {
    expect(value).toBe(42);
  }));
});
