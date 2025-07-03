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

export type Balance = {
  userId: string;
  amount: {
    amount: number;
    currency: string;
  };
};

export type PaymentGraph = {
  userId: string;
  balances: {
    userId: string;
    amount: number;
    currency: string;
  }[];
};
