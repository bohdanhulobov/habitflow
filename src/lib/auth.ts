import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

// Конфігурація NextAuth
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // ТИМЧАСОВА ЛОГІКА - замініть на справжню перевірку з бази даних
        if (
          credentials?.email === "test@example.com" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: "test@example.com",
          };
        }

        // Повертаємо null якщо авторизація не вдалась
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
    // error: "/auth/error",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

// Конфігурація для використання в middleware та серверних компонентах
export const config = {
  providers: authOptions.providers,
  callbacks: authOptions.callbacks,
  pages: authOptions.pages,
  session: authOptions.session,
} satisfies NextAuthOptions;

// Хелпер функція для отримання сесії на сервері
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
