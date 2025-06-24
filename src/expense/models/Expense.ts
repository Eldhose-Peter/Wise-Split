import { BalanceMap } from "./BalanceMap";

export class Expense {
  private readonly userBalances: BalanceMap;
  private readonly description: string;

  constructor(description: string, userBalances: BalanceMap) {
    this.description = description;
    this.userBalances = userBalances;
  }

  public getUserBalances(): BalanceMap {
    return this.userBalances;
  }
}
