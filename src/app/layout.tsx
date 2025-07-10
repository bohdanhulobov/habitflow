import type { Metadata } from "next";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "HabitFlow",
  description: "A simple habit tracking application",
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
