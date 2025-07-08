import { RegisterPayload } from "auth/auth.validation";

export interface User extends RegisterPayload {
  id: number;
  createdAt: Date;
}

export interface UserDetails {
  userName: string;
  email: string;
  id: number;
  firstName: string;
  lastName: string;
  bio: string | null;
  imageUrl: string | null;
}
