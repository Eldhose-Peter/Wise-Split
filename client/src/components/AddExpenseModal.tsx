import React, { useState } from "react";
import { User } from "@/types/user.type";
import { GroupApi } from "@/api/groupsApi";
import { Expense } from "@/types/expense.type";

interface AddExpenseModalProps {
  show: boolean;
  onClose: () => void;
  members: User[];
  currentUser: User | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  show,
  onClose,
  members,
  currentUser,
}) => {
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    currency: "USD",
    paidBy: currentUser ? currentUser.id : "",
    involvedUsers:
      members && members.length > 0 ? members.map((m) => m.id) : [],
  });

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const amount = parseFloat(expenseForm.amount);
            const amountPerUser = amount / expenseForm.involvedUsers.length;

            const expenseData: Omit<Expense, "id" | "createdAt"> = {
              description: expenseForm.description,
              amount: parseFloat(expenseForm.amount),
              currency: expenseForm.currency,
              paidById: expenseForm.paidBy,
              userBalances: expenseForm.involvedUsers.map((m: string) => ({
                userId: m,
                amount: amountPerUser,
              })),
            };

            await GroupApi.createExpense(
              currentUser ? currentUser.id : "",
              expenseData
            );
          }}
        >
          <div className="mb-3">
            <label className="block mb-1 font-medium">Description</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm((f) => ({ ...f, description: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Total Amount</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm((f) => ({ ...f, amount: e.target.value }))
              }
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Currency</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={expenseForm.currency}
              onChange={(e) =>
                setExpenseForm((f) => ({ ...f, currency: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Paid By</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={expenseForm.paidBy || (currentUser ? currentUser.id : "")}
              onChange={(e) =>
                setExpenseForm((f) => ({ ...f, paidBy: e.target.value }))
              }
              required
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.userName || m.email || m.id}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Involved Users</label>
            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto border rounded p-2">
              {members.map((m) => (
                <label key={m.id} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      Array.isArray(expenseForm.involvedUsers)
                        ? expenseForm.involvedUsers.includes(m.id)
                        : false
                    }
                    onChange={(e) => {
                      setExpenseForm((f) => {
                        const prev = Array.isArray(f.involvedUsers)
                          ? f.involvedUsers
                          : [];
                        if (e.target.checked) {
                          return { ...f, involvedUsers: [...prev, m.id] };
                        } else {
                          return {
                            ...f,
                            involvedUsers: prev.filter((id) => id !== m.id),
                          };
                        }
                      });
                    }}
                  />
                  {m.userName || m.email || m.id}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
