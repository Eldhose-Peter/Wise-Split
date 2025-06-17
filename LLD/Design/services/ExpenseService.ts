import { Amount } from "../models/Amount";
import { BalanceMap } from "../models/BalanceMap";
import { Expense } from "../models/Expense";
import { PaymentGraph } from "../models/PaymentGraph";
import { PriorityQueue } from "../utility/PriorityQueue";

export class ExpenseService {
  // select * from expenses where groupId = ?
  private readonly groupExpenses: Map<string, Expense[]>;
  constructor(groupExpenses: Map<string, Expense[]>) {
    this.groupExpenses = groupExpenses;
  }

  public getGroupExpenses(groupId: string): Expense[] {
    return this.groupExpenses.get(groupId) || [];
  }

  // Algorithm
  public getPaymentGraph(groupBalances: BalanceMap): PaymentGraph {
    const positiveQueue = new PriorityQueue<{
      userId: String;
      amount: Amount;
    }>();
    const negativeQueue = new PriorityQueue<{
      userId: String;
      amount: Amount;
    }>();

    const balancesMap: Map<String, Amount> = groupBalances.getBalances();
    balancesMap.forEach((amount, userId) => {
      if (amount.getAmount() > 0) {
        positiveQueue.enqueue({ userId, amount }, amount.getAmount());
      } else if (amount.getAmount() < 0) {
        negativeQueue.enqueue({ userId, amount }, -amount.getAmount());
      }
    });

    const graph: Map<String, BalanceMap> = new Map<String, BalanceMap>();
    while (!positiveQueue.isEmpty() && !negativeQueue.isEmpty()) {
      const positiveEntry = positiveQueue.dequeue();
      const negativeEntry = negativeQueue.dequeue();
      if (!positiveEntry || !negativeEntry) {
        break;
      }
      const positiveAmount = positiveEntry.amount.getAmount();
      const negativeAmount = -negativeEntry.amount.getAmount();
      const positiveUser = positiveEntry.userId;
      const negativeUser = negativeEntry.userId;
      if (!graph.has(positiveUser)) {
        graph.set(positiveUser, new BalanceMap(new Map<String, Amount>()));
      }
      graph
        .get(positiveUser)
        ?.getBalances()
        .set(
          negativeUser,
          new Amount("USD", Math.min(positiveAmount, negativeAmount))
        );

      // If there are remaining positive or negative balances, add them to the graph
      const remaining = positiveAmount - negativeAmount;
      if (remaining > 0) {
        positiveQueue.enqueue(
          { userId: positiveUser, amount: new Amount("USD", remaining) },
          remaining
        );
      } else if (remaining < 0) {
        negativeQueue.enqueue(
          { userId: negativeUser, amount: new Amount("USD", remaining) },
          -remaining
        );
      }
    }

    return new PaymentGraph(graph);
  }
}
