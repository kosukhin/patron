import { expect, test } from 'vitest';
import { Guest } from './Guest';
import { Patron } from './Patron';
import { GuestPool } from './GuestPool';

test('patron pool with guests', () => {
  const pool = new GuestPool(null);
  let receivedCount = 0;

  // 2 + 2
  pool.add(new Patron(new Guest<number>((value) => {
    receivedCount += value;
  })));
  // 2 + 2
  pool.add(new Patron(new Guest<number>((value) => {
    receivedCount += value;
  })));
  // 2
  pool.add(new Guest<number>((value) => {
    receivedCount += value;
  }));
  pool.receive(2);
  pool.receive(2);

  expect(receivedCount).toBe(10);
});
