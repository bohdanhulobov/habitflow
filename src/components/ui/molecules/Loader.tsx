import { Box, LinearProgress, Typography } from "@mui/material";

export default function Loader({
  wording = "Loading...",
}: {
  wording?: string;
}) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
        my: 2,
      }}
    >
      <Typography marginBottom={1}>{wording}</Typography>
      <Box sx={{ width: "80%" }}>
        <LinearProgress />
      </Box>
    </Box>
  );
}
