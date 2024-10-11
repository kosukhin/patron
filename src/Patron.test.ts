import { expect, test } from 'vitest';
import { FakeSource } from '@/modules/system/fake/FakeSource';
import { Patron } from './Patron';
import { Guest } from './Guest';

test('patron always guest', () => {
  const one = new FakeSource(1);
  let patronCalledTimes = 0;
  const patron = new Patron(new Guest(() => {
    patronCalledTimes += 1;
  }));
  one.data(patron);
  one.receive(2);

  queueMicrotask(() => {
    expect(patronCalledTimes).toBe(2);
  });
});
