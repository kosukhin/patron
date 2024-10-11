import { expect, test } from 'vitest';
import { Cache } from './Cache';
import { Guest } from './Guest';

test('value works', () => {
  const value = new Cache(null);
  value.receive(2);
  value.receiving(new Guest((latestValue: number) => {
    expect(latestValue).toBe(2);
  }));

  value.receive(4);
  value.receiving(new Guest((latestValue: number) => {
    expect(latestValue).toBe(4);
  }));
});
