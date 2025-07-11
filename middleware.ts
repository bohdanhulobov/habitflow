import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("Authenticated user accessing:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/",
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
);

export const config = {
  matcher: ["/api/(protected)/:path*", "/(protected)/:path*"],
};
