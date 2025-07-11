"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Content from "../auth/Content";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Stack
      direction="column"
      sx={{
        justifyContent: "center",
        height: "100%",
        p: 2,
      }}
    >
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: { xs: 2, sm: 4 },
          m: "auto",
        }}
      >
        <Content />
        {children}
      </Stack>
    </Stack>
  );
}
