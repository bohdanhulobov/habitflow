"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Content from "@/components/auth/Content";
import AuthSwitcher from "@/components/auth/AuthSwitcher";
import { AuthCard } from "@/types/auth";

interface AuthLayoutProps {
  initialCard?: AuthCard;
}

export default function AuthLayout({
  initialCard = AuthCard.SIGNIN,
}: AuthLayoutProps) {
  const [isSignInCard, setIsSignInCard] = React.useState(
    initialCard === AuthCard.SIGNIN,
  );

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
        {isSignInCard && <Content />}
        <AuthSwitcher
          initialCard={initialCard}
          onCardChange={setIsSignInCard}
        />
      </Stack>
    </Stack>
  );
}
