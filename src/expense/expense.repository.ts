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
        groupId: true,
        createdAt: true,
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
      groupId: number;
      createdAt: Date;
      description: string;
      amount: number;
      currency: string;
      paidById: number;
      participants: Participant[];
    };

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

  public async addExpense(expense: Expense): Promise<void> {
    const userBalances = expense.getUserBalances().getBalances();
    const participants = Array.from(userBalances.entries()).map(
      ([userId, amount]) => ({
        userId: Number(userId),
        amountOwed: amount.getAmount(),
        currency: amount.getCurrency(),
      })
    );

    await prisma.expense.create({
      data: {
        groupId: expense.getGroupId(),
        description: expense.getDescription(),
        amount: expense.getAmount(),
        currency: expense.getCurrency(),
        paidById: expense.getPaidById(),
        participants: {
          createMany: {
            data: participants,
          },
        },
      },
    });
  }
}
