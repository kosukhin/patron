import { expect, test } from 'vitest';
import { Source } from './Source';
import { PatronOnce } from './PatronOnce';
import { Guest } from './Guest';

test('patron once', () => {
  const source = new Source(42);
  let calls = 0;
  const patron = new PatronOnce(new Guest((value) => {
    calls += 1;
  }));
  source.receiving(patron);
  source.receive(22);

  expect(calls).toBe(1);
});
