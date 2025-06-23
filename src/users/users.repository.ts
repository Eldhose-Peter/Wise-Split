import prisma from "lib/prisma";
import { User } from "./users.model";

export class UserRepository {
  public async findAllUsers(): Promise<User[]> {
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
    return result;
  }

  public async findUserById(id: number): Promise<User | null> {
    const result = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        imageUrl: true,
      },
    });
    return result;
  }
}
