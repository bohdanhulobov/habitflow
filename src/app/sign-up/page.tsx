import AuthLayout from "@/components/layout/AuthLayout";
import { AuthCard } from "@/types/auth";

export default function SignUp() {
  return <AuthLayout initialCard={AuthCard.SIGNUP} />;
}
