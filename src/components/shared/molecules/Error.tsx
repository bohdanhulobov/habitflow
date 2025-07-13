import WifiTetheringErrorRoundedOutlinedIcon from "@mui/icons-material/WifiTetheringErrorRoundedOutlined";
import { Typography } from "@mui/material";

export default function Error({ errorMessage }: { errorMessage?: string }) {
  return (
    <Typography color="error" gap={1} display="flex" alignItems="center">
      <WifiTetheringErrorRoundedOutlinedIcon />
      {errorMessage || "An error occurred while loading data."}
    </Typography>
  );
}
