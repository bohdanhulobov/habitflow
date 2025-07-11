import type { Metadata } from "next";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { auth } from "@/lib/auth";
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

  return (
    <html lang="en">
      <head>
        {/* Prevent theme blinking by setting color-scheme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('mui-mode');
                  if (!mode || mode === 'system') {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    mode = prefersDark ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-mui-color-scheme', mode);
                  document.documentElement.style.colorScheme = mode;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <TRPCProvider>
          <ThemeRegistry session={session}>{children}</ThemeRegistry>
        </TRPCProvider>
      </body>
    </html>
  );
}
