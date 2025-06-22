import { NextFunction, Request, Response } from "express";
import { Controller } from "interfaces/controller.interface";
import prisma from "lib/prisma";

class UsersController extends Controller {
  constructor() {
    super("/users");
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(this.path, this.getUsers);
  }

  private getUsers = async (
    _: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      // const result = await pool.query("SELECT id, username, email FROM users");
      const result = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          bio: true,
          imageUrl: true,
        },
      });
      response.json({ users: result });
    } catch (err) {
      next(err);
    }
  };
}

export default UsersController;
