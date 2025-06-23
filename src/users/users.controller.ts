import { NextFunction, Request, Response } from "express";
import { Controller } from "interfaces/controller.interface";
import { UserService } from "./users.service";
import authMiddleware from "middleware/auth.middleware";

class UsersController extends Controller {
  private userService = new UserService();
  constructor() {
    super("/users");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getUsers);
  }

  private getUsers = async (
    _: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.getAllUsers();
      response.json({ users: result });
    } catch (err) {
      next(err);
    }
  };
}

export default UsersController;
