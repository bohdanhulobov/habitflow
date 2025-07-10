import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button, Typography, Box, Container } from "@mui/material";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Привіт, {session.user?.name || session.user?.email}!
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Ви успішно увійшли в систему.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" href="/api/auth/signout">
            Вийти
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
