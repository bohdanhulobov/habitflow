import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Stack,
} from "@mui/material";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HabitFlow
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button color="inherit" href="/stats">
              Statistics
            </Button>
            <Typography variant="body2">
              {session.user?.name || session.user?.email}
            </Typography>
            <Button color="inherit" href="/api/auth/signout">
              Sign Out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

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
