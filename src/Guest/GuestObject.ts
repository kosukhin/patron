import { Guest, GuestObjectType, GuestType, ReceiveOptions } from "./Guest";

export class GuestObject<T> implements GuestObjectType<T> {
  public constructor(private baseGuest: GuestType<T>) {}

  public receive(value: T, options?: ReceiveOptions): this {
    let guest = this.baseGuest;
    if (typeof guest === "function") {
      guest = new Guest(guest);
    }
    guest.receive(value, options);
    return this;
  }

  public introduction() {
    if (typeof this.baseGuest === "function" || !this.baseGuest.introduction) {
      return "guest";
    }

    return this.baseGuest.introduction();
  }
}
