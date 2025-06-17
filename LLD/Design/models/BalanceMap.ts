import { Amount } from "./Amount";
import { User } from "./User";

export class BalanceMap {
  private readonly balances: Map<String, Amount>;

  constructor(map?: Map<String, Amount>) {
    this.balances = map ? map : new Map<String, Amount>();
  }

  public getBalances(): Map<String, Amount> {
    return this.balances;
  }
}
