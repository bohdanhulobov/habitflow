"use client";

import HabitsList from "@/components/habits/HabitsList";
import PageHeader from "@/components/shared/organisms/PageHeader";
import { Box } from "@mui/material";
import NewHabitDrawer from "@/components/habits/NewHabitDrawer";

export default function HabitsPage() {
  return (
    <Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <PageHeader title="Habits" />
        <NewHabitDrawer />
      </Box>
      <HabitsList />
    </Box>
  );
}
