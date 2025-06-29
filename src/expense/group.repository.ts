import prisma from "lib/prisma";

export class GroupRepository {
  public async getGroupMembers(groupId: number): Promise<number[]> {
    const result = await prisma.groupMember.findMany({
      where: { groupId },
      select: {
        userId: true,
      },
    });

    return result.map((member: { userId: number }) => member.userId);
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
