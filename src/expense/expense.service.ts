import { PriorityQueue } from "lib/priorityQueue";
import { Amount } from "./models/Amount";
import { BalanceMap } from "./models/BalanceMap";
import { Expense } from "./models/Expense";
import { PaymentGraph } from "./models/PaymentGraph";
import { ExpenseRepository } from "./expense.repository";
import { ExpenseResult, Participant } from "./expense.types";

export class ExpenseService {
  private expenseRepository: ExpenseRepository;
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  public async getGroupExpenses(groupId: number): Promise<Expense[]> {
    const result = await this.expenseRepository.getExpenseForGroup(groupId);
    // Map result to Expense objects
    const expenses: Expense[] = result.map((item: ExpenseResult) => {
      const paidById = item.paidById;
      const amountPaid = new Amount(item.currency, -item.amount); // Negative because it's an expense paid by the user
      const userBalances: Map<string, Amount> = new Map<string, Amount>();
      item.participants.forEach((participant: Participant) => {
        let amountOwed = new Amount(
          participant.currency,
          participant.amountOwed
        );
        if (participant.userId === paidById) {
          amountOwed = amountOwed.add(amountPaid);
        } else {
          amountOwed = new Amount(participant.currency, participant.amountOwed);
        }
        userBalances.set(participant.userId.toString(), amountOwed);
      });

      const balanceMap = new BalanceMap(userBalances);
      return new Expense(
        item.groupId,
        item.description,
        balanceMap,
        item.amount,
        item.currency,
        paidById,
        new Date(item.createdAt)
      );
    });
    return expenses;
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

  private async validateGroupMembers(
    groupId: number,
    userIds: number[]
  ): Promise<void> {
    const groupMembers = await this.expenseRepository.getGroupMembers(groupId);
    const memberSet = new Set(groupMembers);
    for (const userId of userIds) {
      if (!memberSet.has(userId)) {
        throw new Error(`User with ID ${userId} is not a member of the group.`);
      }
    }
  }

  addExpense(
    groupId: number,
    description: string,
    userBalances: Record<string, number>,
    amount: number,
    currency: string,
    paidBy: number
  ) {
    const balanceMap = new BalanceMap(
      new Map(
        Object.entries(userBalances).map(([userId, userAmount]) => [
          userId,
          new Amount(currency, userAmount),
        ])
      )
    );

    // Validate all users are part of the group
    this.validateGroupMembers(
      groupId,
      Array.from(
        new Set([
          ...Array.from(balanceMap.getBalances().keys()).map(Number),
          paidBy,
        ])
      )
    );

    // Validate that the total amount matches the sum of user balances
    const totalBalance = Array.from(balanceMap.getBalances().values()).reduce(
      (sum, amount) => sum + amount.getAmount(),
      0
    );
    if (totalBalance !== amount) {
      throw new Error(
        `Total balance of user balances (${totalBalance}) does not match the expense amount (${amount}).`
      );
    }
    const expense = new Expense(
      groupId,
      description,
      balanceMap,
      amount,
      currency,
      paidBy
    );
    return this.expenseRepository.addExpense(expense);
  }
}
