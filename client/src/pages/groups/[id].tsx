import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GroupApi } from "@/api/groupsApi";
import { Expense } from "@/types/expense.type";
import { AuthApi } from "@/api/authApi";
import { User } from "@/types/user.type";
import { ExpenseCard } from "@/components/ExpenseCard";

export default function GroupDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  // Get groupName from router state
  const groupName = router.query.groupName || "Group";
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await AuthApi.fetchMe();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    }
    fetchUser();
  }, []);

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
      <h1 className="text-2xl font-bold mb-4">{groupName}</h1>
      <h2 className="text-lg font-semibold mb-2">Expenses</h2>
      {expenses && expenses.length > 0 ? (
        <ul className="mb-6">
          {expenses.map((expense, idx) => (
            <ExpenseCard
              key={idx}
              expense={expense}
              currentUser={currentUser}
            />
          ))}
        </ul>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
}
