import { expect, test } from "vitest";
import { GuestChain } from "./GuestChain";
import { GuestCallback } from "./GuestCallback";
import { SourceOfValue } from "../Source/SourceOfValue";
import { PatronOfGuest } from "../Patron/PatronOfGuest";

test("chain guest returns 2 values after result guest", () => {
  const one = new SourceOfValue(1);
  const two = new SourceOfValue(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  chain.result(
    new GuestCallback((value) => {
      expect(Object.values(value).join()).toBe("1,2");
    }),
  );

  one.receiving(chain.receiveKey("one"));
  two.receiving(chain.receiveKey("two"));
});

test("chain guest returns 2 values before result guest", () => {
  const one = new SourceOfValue(1);
  const two = new SourceOfValue(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.receiving(chain.receiveKey("one"));
  two.receiving(chain.receiveKey("two"));

  chain.result(
    new GuestCallback((value) => {
      expect(Object.values(value).join()).toBe("1,2");
    }),
  );
});

test("chain with patron", () => {
  const one = new SourceOfValue(1);
  const two = new SourceOfValue(2);
  const chain = new GuestChain<{ one: number; two: number }>();

  one.receiving(new PatronOfGuest(chain.receiveKey("one")));
  two.receiving(new PatronOfGuest(chain.receiveKey("two")));

  one.receive(3);
  one.receive(4);

  chain.result(
    new PatronOfGuest(
      new GuestCallback((value: Record<string, unknown>) => {
        expect(Object.values(value).length).toBe(2);
      }),
    ),
  );
});

test("chain as array", () => {
  const one = new SourceOfValue(1);
  const two = new SourceOfValue(2);
  const chain = new GuestChain<[number, number]>();

  one.receiving(new PatronOfGuest(chain.receiveKey("0")));
  two.receiving(new PatronOfGuest(chain.receiveKey("1")));

  chain.resultArray(
    new PatronOfGuest(
      new GuestCallback((value) => {
        expect(JSON.stringify(value)).toBe("[1, 2]");
      }),
    ),
  );
});
