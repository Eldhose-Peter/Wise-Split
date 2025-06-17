export class Amount {
  private readonly currency: string;
  private readonly amount: number;

  constructor(currency: string, amount: number) {
    this.currency = currency;
    this.amount = amount;
  }

  add(other: Amount): Amount {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add amounts with different currencies");
    }
    return new Amount(this.currency, this.amount + other.amount);
  }

  getAmount(): number {
    return this.amount;
  }
}
