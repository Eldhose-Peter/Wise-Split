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
}
