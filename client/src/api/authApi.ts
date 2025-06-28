import { User } from "@/types/user.type";
import { fetchClient } from "./fetchClient";

const API_BASE = "http://localhost:3001/api/v1/auth";

export class AuthApi {
  static async login(email: string, password: string) {
    return fetchClient(`${API_BASE}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(username: string, email: string, password: string) {
    return fetchClient(`${API_BASE}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
  }

  static async fetchMe() {
    return fetchClient<User>(`${API_BASE}/me`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async logout() {
    return fetchClient(`${API_BASE}/logout`, {
      method: "DELETE",
      credentials: "include",
    });
  }
}
