import { expect, test } from 'vitest';
import { Factory } from './Factory';
import { FakeSource } from '@/modules/system/fake/FakeSource';
import { Guest } from './Guest';

test('factory', () => {
  const sourceFactory = new Factory(FakeSource);

  const source = sourceFactory.create(42);

  source.data(new Guest((value) => {
    expect(value).toBe(42);
  }));
});
