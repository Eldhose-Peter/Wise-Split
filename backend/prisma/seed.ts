import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Anderson",
      bio: "Loves to travel",
      imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      firstName: "Bob",
      lastName: "Brown",
      bio: "Enjoys hiking",
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: "charlie@example.com",
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
