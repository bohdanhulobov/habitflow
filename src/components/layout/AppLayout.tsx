"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import AppTheme from "@/styles/theme/AppTheme";
import ColorModeSelect from "@/styles/theme/ColorModeSelect";

interface AppLayoutProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  showColorModeSelect?: boolean;
  centered?: boolean;
}

export default function AppLayout({
  children,
  disableCustomTheme,
  showColorModeSelect = true,
  centered = false,
}: AppLayoutProps) {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      {showColorModeSelect && (
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
      )}
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            minHeight: "100vh",
            ...(centered && {
              justifyContent: "center",
              height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
              marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
            }),
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        {children}
      </Stack>
    </AppTheme>
  );
}
