import { createContext } from "react";

export interface IdentityContextValue {
  userId: string;
  knownUsers: string[];
  setUserId: (id: string) => void;
}

export const IdentityContext = createContext<IdentityContextValue | null>(null);