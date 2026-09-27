import { useContext } from "react";
import { IdentityContext, type IdentityContextValue } from "./context";

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used inside <IdentityProvider>");
  return ctx;
}