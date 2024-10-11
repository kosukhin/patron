import { expect, test } from 'vitest';
import { Source } from './Source';
import { GuestSync } from './GuestSync';

test('guest sync', () => {
  const source = new Source(123);
  const syncGuest = new GuestSync(222);
  expect(syncGuest.value()).toBe(222);
  source.receiving(syncGuest);
  expect(syncGuest.value()).toBe(123);
});
