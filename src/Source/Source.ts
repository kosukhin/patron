import { SourceOfValue } from "./SourceOfValue";
import { SourcesApplied } from "./SourcesApplied";

export class Source {
  public ofValue<P>(sourceDocument: P) {
    return new SourceOfValue(sourceDocument);
  }

  public applySources() {
    return new SourcesApplied();
  }
}
