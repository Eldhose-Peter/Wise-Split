export type Participant = {
  userId: number;
  amountOwed: number;
  currency: string;
};

export type ExpenseResult = {
  id: number;
  groupId: number;
  createdAt: Date;
  description: string;
  amount: number;
  currency: string;
  paidById: number;
  participants: Participant[];
};
