import { BalanceMap } from "./BalanceMap";

export class Expense {
  private readonly userBalances: BalanceMap;
  private readonly title: string;
  private readonly imageUrl: string;
  private readonly description: string;

  constructor(
    title: string,
    imageUrl: string,
    description: string,
    userBalances: BalanceMap
  ) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.userBalances = userBalances;
  }

  public getUserBalances(): BalanceMap {
    return this.userBalances;
  }
}
