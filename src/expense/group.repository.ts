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
    userId: number,
    title: string
  ): Promise<{ id: number; title: string }> {
    const group = await prisma.group.create({
      data: {
        title,
        members: {
          create: {
            userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    return group;
  }
}
