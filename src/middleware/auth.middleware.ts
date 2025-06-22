import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "errors/unauthorized.error";
import { env } from "config/env";
import prisma from "lib/prisma";

async function authMiddleware(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const token = request.cookies.Authentication;
  if (!token) return next(new UnauthorizedError());

  const decoded = jwt.verify(token, env.JWT_SECRET) as { _id: number };
  if (!decoded._id) return next(new UnauthorizedError());

  const result = await prisma.user.findUnique({
    where: { id: decoded._id },
  });

  if (result.rows.length === 0) return next(new UnauthorizedError());

  request.userId = decoded._id;

  next();
}

export default authMiddleware;
