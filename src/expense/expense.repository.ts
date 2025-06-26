import prisma from "lib/prisma";
import { Expense } from "./models/Expense";
import { ExpenseResult } from "./expense.types";

export class ExpenseRepository {
  public async getExpenseForGroup(groupId: number): Promise<ExpenseResult[]> {
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

    return result.map((expense) => ({
      id: expense.id,
      groupId: expense.groupId,
      createdAt: expense.createdAt,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      paidById: expense.paidById,
      participants: expense.participants.map((participant) => ({
        userId: participant.userId,
        amountOwed: participant.amountOwed,
        currency: participant.currency,
      })),
    }));
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

  public async getGroupMembers(groupId: number): Promise<number[]> {
    const result = await prisma.groupMember.findMany({
      where: { groupId },
      select: {
        userId: true,
      },
    });

    return result.map((member) => member.userId);
  }
}
