import HabitsList from "@/components/habits/HabitsList";
import PageHeader from "@/components/ui/organisms/PageHeader";
import { Box } from "@mui/material";

export default function HabitsPage() {
  return (
    <Box>
      <PageHeader title="Habits" />
      <HabitsList />
    </Box>
  );
}
