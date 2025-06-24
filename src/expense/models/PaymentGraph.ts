import { BalanceMap } from "./BalanceMap";

export class PaymentGraph {
  private readonly graph: Map<string, BalanceMap>;

  constructor(graph: Map<string, BalanceMap>) {
    this.graph = graph;
  }

  public getGraph(): Map<string, BalanceMap> {
    return this.graph;
  }

  public toSerializable(): string {
    const result: string[] = [];
    this.graph.forEach((balanceMap, userId) => {
      const balances: string[] = [];
      balanceMap.getBalances().forEach((amount, otherUserId) => {
        balances.push(
          `${otherUserId}: ${amount.getAmount()} ${amount.getCurrency()}`
        );
      });
      result.push(`${userId} -> { ${balances.join(", ")} }`);
    });
    return result.join("\n");
  }
}
