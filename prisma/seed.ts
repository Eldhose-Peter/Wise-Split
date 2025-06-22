import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      userName: "alice123",
      password: bcrypt.hashSync("password123", 10),
      firstName: "Alice",
      lastName: "Anderson",
      bio: "Loves to travel",
      imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      userName: "bob_the_builder",
      password: bcrypt.hashSync("password123", 10),
      firstName: "Bob",
      lastName: "Brown",
      bio: "Enjoys hiking",
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: "charlie@example.com",
      userName: "charlie_chill",
      password: bcrypt.hashSync("password123", 10),
      firstName: "Charlie",
      lastName: "Clark",
      bio: "Foodie",
      imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  });

  // Create Group
  const group = await prisma.group.create({
    data: {
      title: "Trip to Paris",
      members: {
        create: [
          { userId: alice.id },
          { userId: bob.id },
          { userId: charlie.id },
        ],
      },
    },
    include: { members: true },
  });

  // Create Expenses
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expense1 = await prisma.expense.create({
    data: {
      groupId: group.id,
      description: "Hotel booking",
      amount: 300,
      currency: "USD",
      paidById: alice.id,
      participants: {
        create: [
          { userId: alice.id, amountOwed: 100, currency: "USD" },
          { userId: bob.id, amountOwed: 100, currency: "USD" },
          { userId: charlie.id, amountOwed: 100, currency: "USD" },
        ],
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expense2 = await prisma.expense.create({
    data: {
      groupId: group.id,
      description: "Dinner at restaurant",
      amount: 90,
      currency: "USD",
      paidById: bob.id,
      participants: {
        create: [
          { userId: alice.id, amountOwed: 30, currency: "USD" },
          { userId: bob.id, amountOwed: 30, currency: "USD" },
          { userId: charlie.id, amountOwed: 30, currency: "USD" },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
