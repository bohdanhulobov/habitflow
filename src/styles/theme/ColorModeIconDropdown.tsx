import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import IconButton, { IconButtonOwnProps } from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

export default function ColorModeIconDropdown(props: IconButtonOwnProps) {
  const { mode, setMode } = useColorScheme();
  const handleToggle = () => {
    const nextMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    try {
      document.cookie = `mui-mode=${nextMode}; path=/; max-age=31536000`;
    } catch (e) {
      console.error("Failed to set cookie for color mode:", e);
    }
  };

  if (!mode) {
    return null;
  }

  const resolvedMode = mode as "light" | "dark";
  const icon = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
  }[resolvedMode];
  return (
    <IconButton
      data-screenshot="toggle-mode"
      onClick={handleToggle}
      disableRipple
      size="small"
      aria-label="Toggle color mode"
      {...props}
    >
      {icon}
    </IconButton>
  );
}
