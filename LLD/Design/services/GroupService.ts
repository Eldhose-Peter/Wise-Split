import { Amount } from "../models/Amount";
import { BalanceMap } from "../models/BalanceMap";
import { Expense } from "../models/Expense";
import { Group } from "../models/Group";
import { PaymentGraph } from "../models/PaymentGraph";
import { User } from "../models/User";
import { ExpenseService } from "./ExpenseService";

export class GroupService {
  private expenseService: ExpenseService;
  // in-memoery storage for groupID to group mapping
  // TODO: use redis
  private groups: Map<string, Group>;

  constructor(expenseService: ExpenseService, groups: Map<string, Group>) {
    this.expenseService = expenseService;
    this.groups = groups;
  }

  public getGroupPaymentGraph(groupId: string, userId: string): PaymentGraph {
    const groupBalances: BalanceMap = this.getBalances(groupId, userId);
    return this.expenseService.getPaymentGraph(groupBalances);
  }

  private sumExpenses(groupExpenses: Expense[]): BalanceMap {
    // This method should sum up the expenses and return a single Expense object.
    const resultBalances = new Map<String, Amount>();
    for (const expense of groupExpenses) {
      const userBalances: BalanceMap = expense.getUserBalances();
      const userBalancesMap: Map<String, Amount> = userBalances.getBalances();

      userBalancesMap.forEach((amount, user) => {
        const currentUserBalance: Amount =
          resultBalances.get(user) || new Amount("USD", 0);
        resultBalances.set(user, currentUserBalance.add(amount));
      });
    }
    return new BalanceMap(resultBalances);
  }

  public getBalances(groupId: string, userId: string): BalanceMap {
    const group = this.groups.get(groupId);

    // Check if the group exists and if the user is part of the group
    if (!group || !group.getUsers().has(userId)) {
      throw new Error("IllegalAccessException");
    }

    const groupExpenses = this.expenseService.getGroupExpenses(groupId);
    const resultExpense = this.sumExpenses(groupExpenses);
    return resultExpense;
  }
}
