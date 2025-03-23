import { give, GuestType } from "../Guest/Guest";
import { SourceObjectType, SourceType, value } from "./Source";
import { GuestCast } from "../Guest/GuestCast";

/**
 * @url https://kosukhin.github.io/patron.site/#/guest/source-race
 */
export class SourceRace<T> implements SourceObjectType<T> {
  public constructor(private sources: SourceType<T>[]) {
    if (sources === undefined) {
      throw new Error("SourceRace didnt receive sources argument");
    }
  }

  public value(guest: GuestType<T>): this {
    let connectedWithSource: SourceType | null = null;
    this.sources.forEach((source) => {
      value(
        source,
        new GuestCast(<GuestType>guest, (value) => {
          if (!connectedWithSource || connectedWithSource === source) {
            give(value as T, guest);
            connectedWithSource = source;
          }
        }),
      );
    });
    return this;
  }
}
