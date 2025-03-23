import { PrivateType } from "../Private/Private";
import { give, GuestType } from "../Guest/Guest";
import {
  Source,
  SourceObjectType,
  SourceType,
  isSource,
  value,
} from "./Source";
import { SourceAll } from "./SourceAll";
import { GuestCast } from "../Guest/GuestCast";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/source-map
 */
export class SourceMap<T, TG> implements SourceObjectType<TG[]> {
  public constructor(
    private baseSource: SourceType<T[]>,
    private targetSource: PrivateType<SourceType<TG>>,
  ) {
    if (baseSource === undefined) {
      throw new Error("SourceMap didnt receive baseSource argument");
    }
    if (targetSource === undefined) {
      throw new Error("SourceMap didnt receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    const all = new SourceAll();
    value(
      this.baseSource,
      new GuestCast(<GuestType>guest, (theValue) => {
        theValue.forEach((val, index) => {
          const valueSource = isSource(val)
            ? val
            : new Source((innerGuest) => {
                give(val, innerGuest);
              });
          const targetSource = this.targetSource.get(valueSource);
          value(targetSource, all.guestKey(index.toString()));
        });
      }),
    );
    all.valueArray(<GuestType>guest);
    return this;
  }
}
