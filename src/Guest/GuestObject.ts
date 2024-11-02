import { Guest, GuestObjectType, GuestType, GiveOptions } from "./Guest";

export class GuestObject<T> implements GuestObjectType<T> {
  public constructor(private baseGuest: GuestType<T>) {}

  public give(value: T, options?: GiveOptions): this {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.give(value, options);
    return this;
  }

  public introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }
    return this.baseGuest.introduction();
  }
}
