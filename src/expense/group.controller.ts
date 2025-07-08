import { Request, Response, NextFunction } from "express";
import { Controller } from "interfaces/controller.interface";
import { ExpenseService } from "./expense.service";
import { GroupService } from "./groups.service";
import authMiddleware from "middleware/auth.middleware";
import validationMiddleware from "middleware/validation.middleware";
import {
  addExpenseSchema,
  addUserToGroupSchema,
  createGroupSchema,
  getGroupExpensesSchema,
  paymentGraphSchema,
} from "./group.validation";

export class GroupController extends Controller {
  private expenseService = new ExpenseService();
  private groupService = new GroupService(this.expenseService);
  constructor() {
    super("/groups");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(
      `${this.path}/:groupid/user/:userid/payment-graph`,
      authMiddleware,
      validationMiddleware(paymentGraphSchema),
      this.getPaymentGraph
    );
    this.router.get(
      `${this.path}/:groupid/user/:userid/balances`,
      authMiddleware,
      validationMiddleware(paymentGraphSchema),
      this.getGroupBalances
    );
    this.router.post(
      `${this.path}/create`,
      authMiddleware,
      validationMiddleware(createGroupSchema),
      this.createGroup
    );
    this.router.get(`${this.path}/all`, authMiddleware, this.getGroups);
    this.router.post(
      `${this.path}/:groupid/add-users`,
      authMiddleware,
      validationMiddleware(addUserToGroupSchema),
      this.addUsersToGroup
    );
    this.router.get(
      `${this.path}/:groupid/expenses`,
      authMiddleware,
      validationMiddleware(getGroupExpensesSchema),
      this.getGroupExpenses
    );
    this.router.post(
      `${this.path}/:groupid/expense`,
      authMiddleware,
      validationMiddleware(addExpenseSchema),
      this.addGroupExpense
    );
    this.router.get(
      `${this.path}/:groupid/members`,
      authMiddleware,
      this.getGroupMembers
    );
  }

  private getPaymentGraph = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = Number(request.params.groupid);
      const userId = Number(request.params.userid);
      const paymentGraph = await this.groupService.getGroupPaymentGraph(
        groupId,
        userId
      );

      response.json(paymentGraph.toArray());
    } catch (error) {
      next(error);
    }
  };

  private getGroupBalances = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = Number(request.params.groupid);
      const userId = Number(request.params.userid);
      const balances = await this.groupService.getBalances(groupId, userId);
      response.json(balances.toArray());
    } catch (error) {
      next(error);
    }
  };

  private createGroup = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { title, userIds } = request.body;
      const userId = request.userId as number;
      userIds.push(userId); // Include the creator in the group
      const group = await this.groupService.createGroup(userIds, title);
      response.status(201).json(group);
    } catch (error) {
      next(error);
    }
  };

  private getGroups = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.userId as number;
      const groups = await this.groupService.getGroups(userId);
      response.json(groups);
    } catch (error) {
      next(error);
    }
  };

  private addUsersToGroup = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = Number(request.params.groupid);
      const userIds = request.body.userids.map((id: string) => Number(id));
      const userId = request.userId as number;
      await this.groupService.addUsersToGroup(groupId, userIds, userId);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  private getGroupExpenses = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = Number(request.params.groupid);
      const expenses = await this.expenseService.getGroupExpenses(groupId);
      response.json(expenses.map((expense) => expense.toArray()));
    } catch (error) {
      next(error);
    }
  };

  private addGroupExpense = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = Number(request.params.groupid);
      const { description, userBalances, amount, currency, paidById } =
        request.body;


      await this.expenseService.addExpense(
        groupId,
        description,
        userBalances,
        amount,
        currency,
        paidById
      );

      response.status(201).json({});
    } catch (error) {
      next(error);
    }
  };

  private getGroupMembers = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = Number(request.params.groupid);
      const members = await this.groupService.getGroupMembers(groupId);
      response.json(members);
    } catch (error) {
      next(error);
    }
  };
}
