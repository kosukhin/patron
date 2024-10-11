import { expect, test } from 'vitest';
import { Chain } from './Chain';
import { Patron } from './Patron';
import { Guest } from './Guest';
import {Source} from './Source';

test('chain guest returns 2 values after result guest', () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new Chain<any>();

  chain.result(new Guest((value) => {
    expect(Object.values(value).join()).toBe('1,2');
  }));

  one.data(chain.receiveKey('one'));
  two.data(chain.receiveKey('two'));
});

test('chain guest returns 2 values before result guest', () => {
  const one = new FakeSource(1);
  const two = new FakeSource(2);
  const chain = new Chain<any>();

  one.data(chain.receiveKey('one'));
  two.data(chain.receiveKey('two'));

  chain.result(new Guest((value) => {
    expect(Object.values(value).join()).toBe('1,2');
  }));
});

test('chain with patron', () => {
  const one = new FakeSource(1);
  const two = new FakeSource(2);
  const chain = new Chain<any>();

  one.data(new Patron(chain.receiveKey('one')));
  two.data(new Patron(chain.receiveKey('two')));

  one.receive(3);
  one.receive(4);

  chain.result(new Patron(new Guest((value) => {
    expect(Object.values(value).length).toBe(2);
  })));
});

test('chain as array', () => {
  const one = new FakeSource(1);
  const two = new FakeSource(2);
  const chain = new Chain<any>();

  one.data(new Patron(chain.receiveKey('0')));
  two.data(new Patron(chain.receiveKey('1')));

  chain.resultArray(new Patron(new Guest((value) => {
    expect(JSON.stringify(value)).toBe('[1, 2]');
  })));
});
