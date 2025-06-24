import { Amount } from "./Amount";

export class BalanceMap {
  private readonly balances: Map<string, Amount>;

  constructor(map?: Map<string, Amount>) {
    this.balances = map ? map : new Map<string, Amount>();
  }

  public getBalances(): Map<string, Amount> {
    return this.balances;
  }

  public toArray(): { userId: string; amount: Amount }[] {
    const result: { userId: string; amount: Amount }[] = [];
    this.balances.forEach((amount, userId) => {
      result.push({ userId, amount });
    });
    return result;
  }
}
