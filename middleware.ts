import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Middleware function буде викликана тільки якщо authorized callback повертає true
    console.log("Authenticated user accessing:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Повертає true якщо користувач автентифікований
        return !!token;
      },
    },
    pages: {
      signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
);

// Застосовувати middleware тільки до захищених роутів
export const config = {
  matcher: [
    "/api/protected/:path*",
    "/dashboard/:path*",
    // Додайте інші захищені роути тут
  ],
};
