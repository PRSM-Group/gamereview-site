"use client";

import { createContext, useContext } from "react";
import type { AppSession } from "@/lib/auth";

const SessionContext = createContext<AppSession | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: AppSession | null;
}) {
  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}

export function useAppSession() {
  return useContext(SessionContext);
}
