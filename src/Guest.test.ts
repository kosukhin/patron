import { expect, test } from 'vitest';
import { FakeSource } from '@/modules/system/fake/FakeSource';
import { Guest } from './Guest';

test('guest dynamic', () => {
  const one = new FakeSource(1);

  one.data(new Guest((value) => {
    expect(value).toBe(1);
  }));
});
