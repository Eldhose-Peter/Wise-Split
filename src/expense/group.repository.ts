import prisma from "lib/prisma";
import { UserDetails } from "users/users.model";

export class GroupRepository {
  public async getGroupMemberIds(groupId: number): Promise<number[]> {
    const result = await prisma.groupMember.findMany({
      where: { groupId },
      select: {
        userId: true,
      },
    });

    return result.map((member: { userId: number }) => member.userId);
  }

  public async getGroupMembers(groupId: number): Promise<UserDetails[]> {
    return prisma.groupMember
      .findMany({
        where: { groupId },
        select: {
          user: {
            select: {
              id: true,
              userName: true,
              email: true,
              firstName: true,
              lastName: true,
              bio: true,
              imageUrl: true,
            },
          },
        },
      })
      .then((members) =>
        members.map((member) => ({
          id: member.user.id,
          userName: member.user.userName,
          email: member.user.email,
          firstName: member.user.firstName,
          lastName: member.user.lastName,
          bio: member.user.bio,
          imageUrl: member.user.imageUrl,
        }))
      );
  }

  public async createGroup(
    userIds: number[],
    title: string
  ): Promise<{ id: number; title: string }> {
    const group = await prisma.group.create({
      data: {
        title,
        members: {
          create: userIds.map((userId) => ({
            userId,
          })),
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    return group;
  }

  public async getGroupsByUserId(
    userId: number
  ): Promise<{ id: number; title: string }[]> {
    return prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  public async addUsersToGroup(groupId: number, filteredUserIds: number[]) {
    const createData = filteredUserIds.map((userId) => ({
      userId,
      groupId,
    }));

    await prisma.groupMember.createMany({
      data: createData,
      skipDuplicates: true,
    });
  }
}
