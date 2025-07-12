import { Box, Typography } from "@mui/material";

export default function PageHeader({ title }: { title: string }) {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
    </Box>
  );
}
