import * as React from "react";
import { Box } from "@mui/material";
import SignInForm from "@/components/auth/SignInForm";
import SignUpCard from "@/components/auth/SignUpForm";
import { AuthCard } from "@/types/auth";

interface AuthSwitcherProps {
  initialCard?: AuthCard;
  onCardChange?: (isSignIn: boolean) => void;
}

export default function AuthSwitcher({
  initialCard = AuthCard.SIGNIN,
  onCardChange,
}: AuthSwitcherProps) {
  const [currentCard, setCurrentCard] = React.useState<AuthCard>(initialCard);

  React.useEffect(() => {
    onCardChange?.(currentCard === AuthCard.SIGNIN);
  }, [currentCard, onCardChange]);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentCard(path === "/sign-up" ? AuthCard.SIGNUP : AuthCard.SIGNIN);
    };

    const handleSwitchCard = (event: CustomEvent) => {
      const newCard = event.detail === 0 ? AuthCard.SIGNIN : AuthCard.SIGNUP;
      setCurrentCard(newCard);
      const path = newCard === AuthCard.SIGNIN ? "/" : "/sign-up";
      window.history.pushState({}, "", path);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener(
      "switchAuthCard",
      handleSwitchCard as EventListener,
    );

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener(
        "switchAuthCard",
        handleSwitchCard as EventListener,
      );
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {currentCard === AuthCard.SIGNIN ? <SignInForm /> : <SignUpCard />}
    </Box>
  );
}
