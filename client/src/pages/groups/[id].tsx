import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GroupApi } from "@/api/groupsApi";
import { Balance, Expense, PaymentGraph } from "@/types/expense.type";
import { AddExpenseModal } from "@/components/AddExpenseModal";
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
  const [getGraph, setGetGraph] = useState<PaymentGraph | null>(null);
  const [oweGraph, setOweGraph] = useState<Balance[]>();

  // Add Expense Modal State
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  // Fetch group members for splitting
  useEffect(() => {
    if (!id) return;
    async function fetchMembers() {
      try {
        // Assuming GroupApi.getGroupMembers exists and returns User[]
        if (GroupApi.getGroupMembers) {
          const users = await GroupApi.getGroupMembers(id as string);
          setMembers(users);
        }
      } catch {
        console.error("Failed to load group members");
      }
    }
    fetchMembers();
  }, [id]);

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
            setGetGraph(foundGraph);
          }

          const balances = paymentGraphRes
            .map((pg) => {
              const balance = pg.balances.find((b) => {
                return String(b.userId) === String(currentUser.id);
              });
              if (balance) {
                return {
                  userId: pg.userId,
                  amount: {
                    amount: Number(balance.amount),
                    currency: balance.currency || "INR", // Default to INR if currency is not provided
                  },
                };
              }
              return undefined;
            })
            .filter((b): b is Balance => b !== undefined);

          if (balances) {
            setOweGraph(balances);
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
      {/* Add Expense Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{groupName}</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowAddExpense(true)}
        >
          Add Expense
        </button>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        show={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        currentUser={currentUser}
        members={members}
      />

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

      <div className="mb-6 p-4 rounded bg-blue-50">
        <h3 className="text-md font-semibold mb-2 text-blue-800">
          Your Payment Graph
        </h3>
        <div className="text-gray-800">
          {getGraph ? (
            <div>
              {getGraph.balances.map((balance, idx) => (
                <p key={idx} className="mb-2">
                  {balance.userId} owes you ₹{balance.amount.toFixed(2)}{" "}
                  {balance.currency || "INR"}.
                </p>
              ))}
              
            </div>
          ) : (
            <p className="mb-2">You have no pending payments.</p>
          )}

          {oweGraph && oweGraph.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2 text-blue-800">
                Owe Graph
              </h4>
              <ul className="list-disc pl-5">
                {oweGraph.map((balance, idx) => (
                  <li key={idx}>
                    {balance.userId} owes ₹{balance.amount.amount.toFixed(2)}{" "}
                    {balance.amount.currency || "INR"}.
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

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
