"use client";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { api } from "@/components/providers/TRPCProvider";
import Loader from "@/components/ui/molecules/Loader";
import PageHeader from "@/components/ui/organisms/PageHeader";
import Error from "@/components/ui/molecules/Error";

export default function DashboardPage() {
  const { data, isLoading, error } = api.habit.getTodayOverview.useQuery();
  const {
    data: allHabits,
    isLoading: isLoadingAll,
    error: errorAll,
  } = api.habit.getAll.useQuery();

  if (isLoading) {
    return <Loader wording="Loading dashboard..." />;
  }
  if (error || !data) {
    return <Error errorMessage={"Dashboard cannot be fetched"} />;
  }

  return (
    <Box>
      <PageHeader title="Dashboard" />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            Completed today: {data?.completed ?? 0} / {data?.total ?? 0}
          </Typography>
          <Typography variant="subtitle2">
            Completion rate: {data?.completionRate?.toFixed(0) ?? 0}%
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
          {data?.habits?.map((habit) => {
            const completed = habit.logs.length > 0;
            return (
              <Card
                key={habit.id}
                variant="outlined"
                sx={{
                  bgcolor: habit.color + "22",
                  minWidth: 260,
                  flex: "1 1 260px",
                }}
              >
                <CardHeader
                  title={habit.title}
                  subheader={habit.description}
                  action={
                    completed ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="disabled" />
                    )
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Target: {habit.targetValue} {habit.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Frequency: {habit.frequency}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {completed ? "Completed today" : "Not completed today"}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          All Current Habits
        </Typography>
        {isLoadingAll ? (
          <Loader wording="Loading all habits..." />
        ) : errorAll ? (
          <Typography color="error">Error loading all habits</Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {allHabits?.map((habit) => (
              <Card
                key={habit.id}
                variant="outlined"
                sx={{
                  bgcolor: habit.color + "22",
                  minWidth: 220,
                  flex: "1 1 220px",
                }}
              >
                <CardHeader title={habit.title} subheader={habit.description} />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Frequency: {habit.frequency}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Target: {habit.targetValue} {habit.unit}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
