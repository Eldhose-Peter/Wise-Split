import React from "react";
import { Expense } from "@/types/expense.type";
import { User } from "@/types/user.type";

interface ExpenseCardProps {
  expense: Expense;
  currentUser: User | null;
}

function getUserBalance(expense: Expense, userId: string) {
  return expense.userBalances.find((ub) => ub.userId === userId);
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  currentUser,
}) => {
  let cardContent;
  if (!currentUser) {
    cardContent = (
      <div className="text-gray-500">Login to see your details</div>
    );
  } else {
    const userBalance = getUserBalance(expense, currentUser.id);
    if (expense.paidById === currentUser.id) {
      cardContent = (
        <>
          <div className="text-lg font-semibold text-blue-700">
            You paid: {expense.amount} {expense.currency}
          </div>
          {userBalance && userBalance.amount < 0 && (
            <div className="text-red-600">
              You are owed {Math.abs(userBalance.amount)} {userBalance.currency}
            </div>
          )}
        </>
      );
    } else if (userBalance) {
      if (userBalance.amount < 0) {
        cardContent = (
          <div className="text-red-600">
            You owe {Math.abs(userBalance.amount)} {userBalance.currency}
          </div>
        );
      } else if (userBalance.amount > 0) {
        cardContent = (
          <div className="text-green-600">
            You are owed {userBalance.amount} {userBalance.currency}
          </div>
        );
      } else {
        cardContent = <div className="text-gray-500">You are settled up</div>;
      }
    } else {
      cardContent = <div className="text-gray-400">Not involved</div>;
    }
  }
  return (
    <li className="mb-6 p-6 border rounded-lg shadow flex flex-col gap-2 bg-slate-50 hover:bg-slate-100 transition w-full sm:w-[700px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl text-slate-800">
          {expense.description}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(expense.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-1 w-full">
        <div className="flex-1 flex flex-col">
          <div className="text-base text-gray-700">
            Paid by{" "}
            <span className="font-semibold">
              {expense.paidById === currentUser?.id ? "You" : expense.paidById}
            </span>
          </div>
          <div className="text-base text-gray-700">
            Total: {" "}
            <span className="font-semibold">
              {expense.amount} {expense.currency}
            </span>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center mt-2 sm:mt-0">
          {cardContent}
        </div>
      </div>
    </li>
  );
};
