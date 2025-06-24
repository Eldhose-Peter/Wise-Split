import { BalanceMap } from "./BalanceMap";

export class PaymentGraph {
  private readonly graph: Map<string, BalanceMap>;

  constructor(graph: Map<string, BalanceMap>) {
    this.graph = graph;
  }

  public getGraph(): Map<string, BalanceMap> {
    return this.graph;
  }

  public toArray(): {
    userId: string;
    balances: { userId: string; amount: number; currency: string }[];
  }[] {
    const result: {
      userId: string;
      balances: { userId: string; amount: number; currency: string }[];
    }[] = [];
    this.graph.forEach((balanceMap, userId) => {
      const balances: { userId: string; amount: number; currency: string }[] =
        [];
      balanceMap.getBalances().forEach((amount, otherUserId) => {
        balances.push({
          userId: otherUserId,
          amount: amount.getAmount(),
          currency: amount.getCurrency(),
        });
      });
      result.push({ userId, balances });
    });
    return result;
  }
}
