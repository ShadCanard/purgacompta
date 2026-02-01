import { User } from "./user";

export interface AccountHistory {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  notes?: string | null;
  user?: User | null;
}