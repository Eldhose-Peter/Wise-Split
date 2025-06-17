import { BalanceMap } from "./BalanceMap";
import { User } from "./User";

export class PaymentGraph {
  private readonly graph: Map<String, BalanceMap>;

  constructor(graph: Map<String, BalanceMap>) {
    this.graph = graph;
  }

  public getGraph(): Map<String, BalanceMap> {
    return this.graph;
  }
}
