import { expect, test } from "vitest";
import { Chain } from "./Chain";
import { Patron } from "./Patron";
import { Guest } from "./Guest";
import { Source } from "./Source";

test("chain guest returns 2 values after result guest", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new Chain<{ one: number; two: number }>();

  chain.result(
    new Guest((value) => {
      expect(Object.values(value).join()).toBe("1,2");
    }),
  );

  one.receiving(chain.receiveKey("one"));
  two.receiving(chain.receiveKey("two"));
});

test("chain guest returns 2 values before result guest", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new Chain<{ one: number; two: number }>();

  one.receiving(chain.receiveKey("one"));
  two.receiving(chain.receiveKey("two"));

  chain.result(
    new Guest((value) => {
      expect(Object.values(value).join()).toBe("1,2");
    }),
  );
});

test("chain with patron", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new Chain<{ one: number; two: number }>();

  one.receiving(new Patron(chain.receiveKey("one")));
  two.receiving(new Patron(chain.receiveKey("two")));

  one.receive(3);
  one.receive(4);

  chain.result(
    new Patron(
      new Guest((value) => {
        expect(Object.values(value).length).toBe(2);
      }),
    ),
  );
});

test("chain as array", () => {
  const one = new Source(1);
  const two = new Source(2);
  const chain = new Chain<[number, number]>();

  one.receiving(new Patron(chain.receiveKey("0")));
  two.receiving(new Patron(chain.receiveKey("1")));

  chain.resultArray(
    new Patron(
      new Guest((value) => {
        expect(JSON.stringify(value)).toBe("[1, 2]");
      }),
    ),
  );
});
