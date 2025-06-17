import { Amount } from "../Design/models/Amount";
import { BalanceMap } from "../Design/models/BalanceMap";
import { Expense } from "../Design/models/Expense";
import { Group } from "../Design/models/Group";
import { PaymentGraph } from "../Design/models/PaymentGraph";
import { ExpenseService } from "../Design/services/ExpenseService";
import { GroupService } from "../Design/services/GroupService";

describe("GroupPaymentGraph", () => {
  function createExpenseService(): ExpenseService {
    const expenses: Expense[] = [];
    const firstExpense = new BalanceMap();
    firstExpense.getBalances().set("user1", new Amount("USD", 10));
    firstExpense.getBalances().set("user2", new Amount("USD", 20));
    firstExpense.getBalances().set("user3", new Amount("USD", -30));

    expenses.push(
      new Expense("Expense 1", "image1.png", "Description 1", firstExpense)
    );

    const secondExpense = new BalanceMap();
    secondExpense.getBalances().set("user1", new Amount("USD", -50));
    secondExpense.getBalances().set("user2", new Amount("USD", 10));
    secondExpense.getBalances().set("user3", new Amount("USD", 40));
    expenses.push(
      new Expense("Expense 2", "image2.png", "Description 2", secondExpense)
    );

    const thirdExpense = new BalanceMap();
    thirdExpense.getBalances().set("user1", new Amount("USD", 90));
    thirdExpense.getBalances().set("user3", new Amount("USD", -90));
    expenses.push(
      new Expense("Expense 3", "image3.png", "Description 3", thirdExpense)
    );

    const groupExpenses = new Map<string, Expense[]>();
    groupExpenses.set("group1", expenses);

    const expenseService: ExpenseService = new ExpenseService(groupExpenses);
    return expenseService;
  }

  it("group balance test", () => {
    const groups = new Map<string, Group>();
    const userList = new Set<string>(["user1", "user2", "user3"]);
    groups.set(
      "group1",
      new Group("Group 1", "Description 1", "image1.png", userList)
    );

    const expenseService: ExpenseService = createExpenseService();

    const groupService: GroupService = new GroupService(expenseService, groups);
    const groupId = "group1";
    const userId = "user1";

    const groupBalances: BalanceMap = groupService.getBalances(groupId, userId);
    const groupBalancesMap: Map<String, Amount> = groupBalances.getBalances();
    expect(groupBalancesMap.size).toBe(3);
    expect(groupBalancesMap.get("user1")?.getAmount()).toBe(50);
    expect(groupBalancesMap.get("user2")?.getAmount()).toBe(30);
    expect(groupBalancesMap.get("user3")?.getAmount()).toBe(-80);
  });

  it("group payment graph test", () => {
    const groups = new Map<string, Group>();
    const userList = new Set<string>(["user1", "user2", "user3"]);
    groups.set(
      "group1",
      new Group("Group 1", "Description 1", "image1.png", userList)
    );

    const expenseService: ExpenseService = createExpenseService();

    const groupService: GroupService = new GroupService(expenseService, groups);
    const groupId = "group1";
    const userId = "user1";

    const paymentGraph: PaymentGraph = groupService.getGroupPaymentGraph(
      groupId,
      userId
    );

    // Check the graph structure
    expect(paymentGraph).toBeInstanceOf(PaymentGraph);
    const graph = paymentGraph.getGraph();
    expect(graph.size).toBe(2);

    // Check balances for user2
    const user2Balances = graph.get("user2");
    expect(user2Balances).toBeDefined();
    expect(user2Balances?.getBalances().get("user3")?.getAmount()).toBe(30);

    // Check balances for user3
    const user3Balances = graph.get("user1");
    expect(user3Balances).toBeDefined();
    expect(user3Balances?.getBalances().get("user3")?.getAmount()).toBe(50);
  });
});
