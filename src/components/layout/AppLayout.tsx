"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import AppTheme from "@/styles/theme/AppTheme";
import NavigationBar from "./NavigationBar";
import ColorModeIconDropdown from "@/styles/theme/ColorModeIconDropdown";

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
        <ColorModeIconDropdown
          sx={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            scale: "1.2",
          }}
        />
      )}
      <NavigationBar />
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
        ]}
      >
        {children}
      </Stack>
    </AppTheme>
  );
}
