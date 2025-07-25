import { z } from "zod";

export const paymentGraphSchema = z.object({
  params: z.object({
    groupid: z.string().min(1, "groupid is required"),
    userid: z.string().min(1, "userid is required"),
  }),
});

export const createGroupSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Group name is required"),
    userIds: z.array(z.number()),
  }),
});

export const addUserToGroupSchema = z.object({
  params: z.object({
    groupid: z.string().min(1, "groupid is required"),
  }),
  body: z.object({
    userids: z
      .array(z.string().min(1, "userid is required"))
      .min(1, "At least one userid is required"),
  }),
});

export const getGroupExpensesSchema = z.object({
  params: z.object({
    groupid: z.string().min(1, "groupid is required"),
  }),
});

export const addExpenseSchema = z.object({
  params: z.object({
    groupid: z.string().min(1, "groupid is required"),
  }),
  body: z.object({
    description: z.string().min(1, "Description is required"),
    userBalances: z.array(
      z.object({
        userId: z.number().min(1, "User ID is required"),
        amount: z.number(),
      })
    ),
    currency: z.string().min(1, "Currency is required"),
    amount: z.number().min(0, "Amount must be a positive number"),
    paidById: z.number().min(1, "paidById is required"),
  }),
});
