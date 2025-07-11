"use client";

import * as React from "react";
import AuthLayout from "./AuthLayout";
import SignUpCard from "../auth/SignUpCard";

export default function SignUpLayout() {
  return (
    <AuthLayout>
      <SignUpCard />
    </AuthLayout>
  );
}
