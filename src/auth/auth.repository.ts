import prisma from "lib/prisma";
import { RegisterPayload } from "./auth.validation";
import { User } from "users/users.model";

export class AuthRepository {
  public async createUser(payload: RegisterPayload): Promise<User> {
    const result = await prisma.user.create({
      data: {
        email: payload.email,
        userName: payload.userName,
        password: payload.password, // Ensure this is hashed before saving
        firstName: payload.firstName,
        lastName: payload.lastName,
        bio: payload.bio,
        imageUrl: payload.imageUrl,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        bio: true,
        imageUrl: true,
      },
    });
    return result;
  }

  public async findUserById(id: number): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        bio: true,
        imageUrl: true,
      },
    });
    if (!result) return null;
    return result;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        bio: true,
        imageUrl: true,
      },
    });
    if (!result) return null;
    return result;
  }

  public async findUserByUserName(userName: string): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: { userName },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        bio: true,
        imageUrl: true,
      },
    });
    if (!result) return null;
    return result;
  }
}
