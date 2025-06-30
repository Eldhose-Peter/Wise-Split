type UserBalance = {
  userId: string;
  amount: number;
  currency: string;
};

export type Expense = {
  description: string;
  userBalances: UserBalance[];
  amount: number;
  currency: string;
  paidById: string | number;
  createdAt: string;
};
