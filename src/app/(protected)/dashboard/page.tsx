import { Container, Typography, Box } from "@mui/material";

export default async function DashboardPage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Track your daily habits and build better routines.
          </Typography>

          <Box sx={{ mt: 4 }}></Box>
        </Box>
      </Container>
    </>
  );
}
