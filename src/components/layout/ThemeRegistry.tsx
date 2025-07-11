"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import AppLayout from "./AppLayout";

export default function ThemeRegistry({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <AppRouterCacheProvider>
        <AppLayout>{children}</AppLayout>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
