import type { Metadata } from "next";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import "@/styles/globals.css";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { TRPCProvider } from "@/components/providers/TRPCProvider";

export const metadata: Metadata = {
  title: "HabitFlow",
  description: "A simple habit tracking application",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-16x16.svg",
        sizes: "16x16",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // SSR: Read theme mode from cookie
  const cookieStore = await cookies();
  let mode = cookieStore.get("mui-mode")?.value;

  if (!mode) {
    mode = "light";
  }

  return (
    <html lang="en" data-mui-color-scheme={mode} style={{ colorScheme: mode }}>
      <head>
        {/* This tag prevent theme blinking by setting color-scheme before hydration */}
      </head>
      <body>
        <TRPCProvider>
          <ThemeRegistry session={session}>{children}</ThemeRegistry>
        </TRPCProvider>
      </body>
    </html>
  );
}
