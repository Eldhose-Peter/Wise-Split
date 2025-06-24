import { z } from "zod";

export const paymentGraphSchema = z.object({
  params: z.object({
    groupid: z.string().min(1, "groupid is required"),
    userid: z.string().min(1, "userid is required"),
  }),
});
