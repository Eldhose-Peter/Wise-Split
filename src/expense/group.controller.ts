import { Request, Response, NextFunction } from "express";
import { Controller } from "interfaces/controller.interface";
import { ExpenseService } from "./expense.service";
import { GroupService } from "./groups.service";
import authMiddleware from "middleware/auth.middleware";
import validationMiddleware from "middleware/validation.middleware";
import { createGroupSchema, paymentGraphSchema } from "./group.validation";

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
      const { title } = request.body;
      const userId = request.userId as number;
      const group = await this.groupService.createGroup(userId, title);
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
}
