import { ExpenseService } from "./expense.service";
import { GroupRepository } from "./group.repository";
import { Amount } from "./models/Amount";
import { BalanceMap } from "./models/BalanceMap";
import { Expense } from "./models/Expense";
import { PaymentGraph } from "./models/PaymentGraph";

export class GroupService {
  private expenseService: ExpenseService;
  private groupRepository: GroupRepository;

  constructor(expenseService: ExpenseService) {
    this.expenseService = expenseService;
    this.groupRepository = new GroupRepository();
  }

  public async getGroupPaymentGraph(
    groupId: number,
    userId: number
  ): Promise<PaymentGraph> {
    const groupBalances: BalanceMap = await this.getBalances(groupId, userId);
    return this.expenseService.getPaymentGraph(groupBalances);
  }

  private sumExpenses(groupExpenses: Expense[]): BalanceMap {
    // This method should sum up the expenses and return a single Expense object.
    const resultBalances = new Map<string, Amount>();
    for (const expense of groupExpenses) {
      const userBalances: BalanceMap = expense.getUserBalances();
      const userBalancesMap: Map<string, Amount> = userBalances.getBalances();

      userBalancesMap.forEach((amount, user) => {
        const currentUserBalance: Amount =
          resultBalances.get(user) || new Amount("USD", 0);
        resultBalances.set(user, currentUserBalance.add(amount));
      });
    }
    return new BalanceMap(resultBalances);
  }

  public async getBalances(
    groupId: number,
    userId: number
  ): Promise<BalanceMap> {
    const group = await this.groupRepository.getGroupMembers(groupId);

    // Check if the group exists and if the user is part of the group
    if (group.length == 0 || !group.includes(userId)) {
      throw new Error("IllegalAccessException");
    }

    const groupExpenses = await this.expenseService.getGroupExpenses(groupId);
    const resultExpense = this.sumExpenses(groupExpenses);
    return resultExpense;
  }
}
