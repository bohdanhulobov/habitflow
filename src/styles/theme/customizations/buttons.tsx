import type { Theme } from "@mui/material/styles";

export const buttonCustomizations = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        "&.Mui-disabled": {
          opacity: 0.3,
          color: theme.palette.text.secondary,
        },
      }),
    },
  },
};
