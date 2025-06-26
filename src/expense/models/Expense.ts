import { BalanceMap } from "./BalanceMap";

export class Expense {
  private readonly userBalances: BalanceMap;
  private readonly description: string;
  private readonly amount: number;
  private readonly currency: string;
  private readonly paidById: number;

  private readonly createdAt: Date;
  private readonly groupId: number;

  constructor(
    groupId: number,
    description: string,
    userBalances: BalanceMap,
    amount: number,
    currency: string,
    paidById: number,
    createdAt?: Date
  ) {
    this.groupId = groupId;
    this.description = description;
    this.userBalances = userBalances;
    this.amount = amount;
    this.currency = currency;
    this.paidById = paidById;
    this.createdAt = createdAt || new Date();
  }

  public getUserBalances(): BalanceMap {
    return this.userBalances;
  }

  public getDescription(): string {
    return this.description;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getPaidById(): number {
    return this.paidById;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getGroupId(): number {
    return this.groupId;
  }

  public toArray(): {
    description: string;
    userBalances: { userId: string; amount: number; currency: string }[];
    amount: number;
    currency: string;
    paidById: number;
    createdAt: Date;
  } {
    const userBalancesArray = Array.from(
      this.userBalances.getBalances().entries()
    ).map(([userId, amount]) => ({
      userId,
      amount: amount.getAmount(),
      currency: amount.getCurrency(),
    }));

    return {
      description: this.description,
      userBalances: userBalancesArray,
      amount: this.amount,
      currency: this.currency,
      paidById: this.paidById,
      createdAt: this.createdAt,
    };
  }
}
