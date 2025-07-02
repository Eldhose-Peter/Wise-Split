/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // Load users
  const usersPath = path.join(__dirname, "seed-data", "users.json");
  const usersData = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  // Create users and map userName to userId
  const userMap: Record<string, any> = {};
  for (const user of usersData) {
    const created = await prisma.user.create({
      data: {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      },
    });
    userMap[user.userName] = created;
  }

  // Load groups
  const groupsPath = path.join(__dirname, "seed-data", "groups.json");
  const groupsData = JSON.parse(fs.readFileSync(groupsPath, "utf-8"));

  // Create groups and map groupTitle to groupId
  const groupMap: Record<string, any> = {};
  for (const group of groupsData) {
    const created = await prisma.group.create({
      data: {
        title: group.title,
        members: {
          create: group.memberUserNames.map((userName: string) => ({
            userId: userMap[userName].id,
          })),
        },
      },
      include: { members: true },
    });
    groupMap[group.title] = created;
  }

  // Load expenses
  const expensesPath = path.join(__dirname, "seed-data", "expenses.json");
  const expensesData = JSON.parse(fs.readFileSync(expensesPath, "utf-8"));

  // Create expenses
  for (const expense of expensesData) {
    const group = groupMap[expense.groupTitle];
    const paidBy = userMap[expense.paidByUserName];
    if (!group || !paidBy) continue;
    const splitAmount =
      Math.round((expense.amount / expense.participants.length) * 100) / 100;
    await prisma.expense.create({
      data: {
        groupId: group.id,
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency,
        paidById: paidBy.id,
        participants: {
          create: expense.participants.map((userName: string) => ({
            userId: userMap[userName].id,
            amountOwed: splitAmount,
            currency: expense.currency,
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
