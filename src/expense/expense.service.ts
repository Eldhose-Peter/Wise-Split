import { PriorityQueue } from "lib/priorityQueue";
import { Amount } from "./models/Amount";
import { BalanceMap } from "./models/BalanceMap";
import { Expense } from "./models/Expense";
import { PaymentGraph } from "./models/PaymentGraph";
import { ExpenseRepository } from "./expense.repository";

export class ExpenseService {
  private expenseRepository: ExpenseRepository;
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  public async getGroupExpenses(groupId: number): Promise<Expense[]> {
    return await this.expenseRepository.getExpenseForGroup(groupId);
  }

  // Algorithm
  public getPaymentGraph(groupBalances: BalanceMap): PaymentGraph {
    const positiveQueue = new PriorityQueue<{
      userId: string;
      amount: Amount;
    }>();
    const negativeQueue = new PriorityQueue<{
      userId: string;
      amount: Amount;
    }>();

    const balancesMap: Map<string, Amount> = groupBalances.getBalances();
    balancesMap.forEach((amount, userId) => {
      if (amount.getAmount() > 0) {
        positiveQueue.enqueue({ userId, amount }, amount.getAmount());
      } else if (amount.getAmount() < 0) {
        negativeQueue.enqueue({ userId, amount }, -amount.getAmount());
      }
    });

    const graph: Map<string, BalanceMap> = new Map<string, BalanceMap>();
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
        graph.set(positiveUser, new BalanceMap(new Map<string, Amount>()));
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
