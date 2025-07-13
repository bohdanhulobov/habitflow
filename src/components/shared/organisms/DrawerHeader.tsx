import { Box, Typography } from "@mui/material";
import FirstPageOutlinedIcon from "@mui/icons-material/FirstPageOutlined";

export default function DrawerHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <Box
      flexDirection={"row"}
      display="flex"
      alignItems={"center"}
      gap={1}
      padding={2}
    >
      <FirstPageOutlinedIcon
        onClick={onClose}
        sx={{
          cursor: "pointer",
          ":hover": { color: "primary.main" },
        }}
        data-testid="drawer-close-icon"
      />
      <Typography variant="h4" component="h2">
        {title}
      </Typography>
    </Box>
  );
}
