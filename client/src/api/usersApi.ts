import { fetchClient } from "./fetchClient";
import { User } from "@/types/user.type";

const API_BASE = "http://localhost:3001/api/v1/users";

export class UsersApi {
  static async getAllUsers() {
    return fetchClient<{ users: User[] }>(`${API_BASE}`, {
      method: "GET",
      credentials: "include",
    });
  }
}
