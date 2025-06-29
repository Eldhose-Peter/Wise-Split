import { fetchClient } from "./fetchClient";
import { Group } from "@/types/group.type";

const API_BASE = "http://localhost:3001/api/v1/groups";

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
}
