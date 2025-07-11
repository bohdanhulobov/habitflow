import type { DefaultSession } from "next-auth";

export enum AuthCard {
  SIGNIN = "signin",
  SIGNUP = "signup",
}

export type AuthCardType = keyof typeof AuthCard;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
