import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "errors/unauthorized.error";
import { env } from "config/env";
import { UserService } from "users/users.service";

async function authMiddleware(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const token = request.cookies.Authentication;
  if (!token) return next(new UnauthorizedError());

  const decoded = jwt.verify(token, env.JWT_SECRET) as { _id: number };
  if (!decoded._id) return next(new UnauthorizedError());

  const userService = new UserService();
  const result = await userService.getUserById(decoded._id);

  if (!result) return next(new UnauthorizedError());

  request.userId = decoded._id;

  next();
}

export default authMiddleware;
