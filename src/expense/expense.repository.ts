import prisma from "lib/prisma";
import { Expense } from "./models/Expense";
import { BalanceMap } from "./models/BalanceMap";
import { Amount } from "./models/Amount";

export class ExpenseRepository {
  public async getExpenseForGroup(groupId: number): Promise<Expense[]> {
    const result = await prisma.expense.findMany({
      where: { groupId },
      select: {
        id: true,
        description: true,
        amount: true,
        currency: true,
        paidById: true,
        participants: {
          select: {
            userId: true,
            amountOwed: true,
            currency: true,
          },
        },
      },
    });

    // Map result to Expense objects
    type Participant = {
      userId: number;
      amountOwed: number;
      currency: string;
    };

    type ExpenseResult = {
      id: number;
      description: string;
      amount: number;
      currency: string;
      paidById: number;
      participants: Participant[];
    };

    const expenses: Expense[] = result.map((item: ExpenseResult) => {
      const description = item.description;
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
      return new Expense(description, balanceMap);
    });
    return expenses;
  }
}
