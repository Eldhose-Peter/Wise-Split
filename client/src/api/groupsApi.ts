import { Balance, Expense, PaymentGraph } from "@/types/expense.type";
import { fetchClient } from "./fetchClient";
import { Group } from "@/types/group.type";
import { User } from "@/types/user.type";

const API_BASE = "/api/v1/groups";

export class GroupApi {
  static async getAllGroups() {
    return fetchClient<Group[]>(`${API_BASE}/all`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async createGroup(data: { title: string; userIds: string[] }) {
    return fetchClient<Group>(`${API_BASE}/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  static async getExpenses(id: string) {
    return fetchClient<Expense[]>(`${API_BASE}/${id}/expenses`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async createExpense(
    groupId: string,
    expense: Omit<Expense, "id" | "createdAt">
  ) {
    console.log(JSON.stringify(expense));
    return fetchClient<Expense>(`${API_BASE}/${groupId}/expense`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
  }

  static async getBalances(groupId: string, userId: number) {
    return fetchClient<Balance[]>(
      `${API_BASE}/${groupId}/user/${userId}/balances`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  static async getPaymentGraph(groupId: string, userId: number) {
    return fetchClient<PaymentGraph[]>(
      `${API_BASE}/${groupId}/user/${userId}/payment-graph`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  }

  static async getGroupMembers(groupId: string) {
    return fetchClient<User[]>(`${API_BASE}/${groupId}/members`, {
      method: "GET",
      credentials: "include",
    });
  }
}
