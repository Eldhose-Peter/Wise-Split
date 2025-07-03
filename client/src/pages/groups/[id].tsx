import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GroupApi } from "@/api/groupsApi";
import { Expense, PaymentGraph } from "@/types/expense.type";
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

  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [graph, setGraph] = useState<PaymentGraph | null>(null);

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

  // Fetch balances and payment graph for current user
  useEffect(() => {
    if (!id || !currentUser) return;
    async function fetchBalancesAndGraph() {
      try {
        const userId =
          typeof currentUser?.id === "string"
            ? parseInt(currentUser.id, 10)
            : currentUser?.id;
        if (!userId) return;

        const balancesRes = await GroupApi.getBalances(id as string, userId);

        if (balancesRes && currentUser) {
          const found = balancesRes.find((b) => {
            // b.userId can be string or number, currentUser.id can be string or number
            return String(b.userId) === String(currentUser.id);
          });

          if (found) {
            setUserBalance(Number(found.amount.amount));
          } else {
            setUserBalance(null);
          }
        }

        const paymentGraphRes = await GroupApi.getPaymentGraph(
          id as string,
          userId
        );

        console.log("Payment Graph:", paymentGraphRes);

        if (paymentGraphRes && currentUser) {
          const foundGraph = paymentGraphRes.find((pg) => {
            return String(pg.userId) === String(currentUser.id);
          });
          if (foundGraph) {
            setGraph(foundGraph);
          }
        }
      } catch {
        // Optionally set error
      }
    }
    fetchBalancesAndGraph();
  }, [id, currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex-grow max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{groupName}</h1>
      {/* Owe/Owed Section */}
      {userBalance !== null && (
        <div className="mb-6 p-4 rounded bg-gray-100 flex items-center justify-between">
          {userBalance > 0 ? (
            <span className="text-lg font-semibold text-red-600">
              You owe ₹{userBalance.toFixed(2)}
            </span>
          ) : userBalance < 0 ? (
            <span className="text-lg font-semibold text-green-600">
              You are owed ₹{Math.abs(userBalance).toFixed(2)}
            </span>
          ) : (
            <span className="text-lg font-semibold text-gray-700">
              You are settled up
            </span>
          )}
        </div>
      )}

      {/* Payment Graph Section */}
      {graph && (
        <div className="mb-6 p-4 rounded bg-blue-50">
          <h3 className="text-md font-semibold mb-2 text-blue-800">
            Your Payment Graph
          </h3>
          <div className="text-gray-800">
            {graph.balances && graph.balances.length > 0 ? (
              <ul className="list-disc pl-5">
                {graph.balances.map((balance, idx) => (
                  <li key={idx}>
                    {balance.amount > 0 ? (
                      <>
                        You need to pay{" "}
                        <span className="font-semibold">
                          ₹{balance.amount.toFixed(2)}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">{balance.userId}</span>
                      </>
                    ) : balance.amount < 0 ? (
                      <>
                        You will receive{" "}
                        <span className="font-semibold">
                          ₹{Math.abs(balance.amount).toFixed(2)}
                        </span>{" "}
                        from{" "}
                        <span className="font-semibold">{balance.userId}</span>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <span>No payments required.</span>
            )}
          </div>
        </div>
      )}
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
