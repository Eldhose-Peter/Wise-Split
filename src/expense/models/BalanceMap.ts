import { Amount } from "./Amount";

export class BalanceMap {
  private readonly balances: Map<string, Amount>;

  constructor(map?: Map<string, Amount>) {
    this.balances = map ? map : new Map<string, Amount>();
  }

  public getBalances(): Map<string, Amount> {
    return this.balances;
  }

  public toSerializable(): string {
    const result: string[] = [];
    this.balances.forEach((amount, userId) => {
      result.push(`${userId}: ${amount.getAmount()} ${amount.getCurrency()}`);
    });
    return result.join(", ");
  }
}
