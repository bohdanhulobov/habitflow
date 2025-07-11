import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import { AuthCard } from "@/types/auth";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <AuthLayout initialCard={AuthCard.SIGNIN} />;
}
