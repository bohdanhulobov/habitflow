"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import SignInCard from "../auth/SignInCard";
import Content from "../auth/Content";

export default function SignInLayout() {
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
        <SignInCard />
      </Stack>
    </Stack>
  );
}
