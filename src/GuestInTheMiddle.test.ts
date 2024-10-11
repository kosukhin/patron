import { test, expect } from 'vitest';
import { FakeSource } from '@/modules/system/fake/FakeSource';
import { Guest } from './Guest';
import { GuestInTheMiddle } from './GuestInTheMiddle';
import { Patron } from './Patron';
import { Chain } from './Chain';

test('test guest in the middle', () => {
  const one = new FakeSource(1);

  let accumValue = 0;
  const guest = new Guest((value: number) => {
    accumValue += value;
  });
  one.data(new GuestInTheMiddle(guest, (value) => {
    guest.receive(value + 3);
  }));

  expect(accumValue).toBe(4);
});

test('test patron in the middle', () => {
  const one = new FakeSource(1);

  let accumValue = 0;
  const guest = new Patron(new Guest((value: number) => {
    accumValue += value;
  }));
  one.data(new GuestInTheMiddle(guest, (value) => {
    guest.receive(value + 3);
  }));
  one.receive(3);
  one.receive(3);

  expect(accumValue).toBe(16);
});

test('test chain in the middle', () => {
  const one = new FakeSource(1);
  const two = new FakeSource(2);
  const chain = new Chain<any>();

  one.data(new Patron(chain.receiveKey('one')));
  two.data(new Patron(chain.receiveKey('two')));

  one.receive(3);
  one.receive(4);

  const guest = new Patron(new Guest((value: any) => {
    expect(Object.values(value).length).toBe(3);
  }));

  chain.result(new GuestInTheMiddle(guest, (value) => {
    guest.receive({ ...value, three: 99 });
  }));
});
