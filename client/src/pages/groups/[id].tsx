import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GroupApi } from "@/api/groupsApi";
import { Expense } from "@/types/expense.type";

export default function GroupDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchGroup() {
      try {
        const data = await GroupApi.getExpenses(id as string);
        setExpenses(data);
      } catch {
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      {expenses && expenses.length > 0 ? (
        <ul className="mb-6">
          {expenses.map((expense, idx) => (
            <li key={idx} className="mb-4 p-4 border rounded">
              <div className="font-semibold">{expense.description}</div>
              <div>
                Amount: {expense.amount} {expense.currency}
              </div>
              <div>Paid By: {expense.paidById}</div>
              <div>Date: {new Date(expense.createdAt).toLocaleString()}</div>
              <div className="mt-2">
                <span className="font-medium">User Balances:</span>
                <ul className="ml-4 list-disc">
                  {expense.userBalances.map((ub, i) => (
                    <li key={i}>
                      User {ub.userId}: {ub.amount} {ub.currency}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
}
