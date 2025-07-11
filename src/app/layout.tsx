import type { Metadata } from "next";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { auth } from "@/lib/auth";

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

  return (
    <html lang="en">
      <body>
        <ThemeRegistry session={session}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
