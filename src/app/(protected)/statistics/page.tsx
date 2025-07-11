"use client";
import { Container, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { api } from "@/components/providers/TRPCProvider";
import type { StatisticsData, HabitData } from "@/types/statistics";

export default function StatisticsPage() {
  const { data, isLoading, error } =
    api.statistics.getStatistics.useQuery<StatisticsData>();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }
  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Error loading statistics.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Statistics
        </Typography>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: data.habitData.map((h: HabitData) => h.habit),
            },
          ]}
          series={[{ data: data.habitData.map((h: HabitData) => h.count) }]}
          width={500}
          height={300}
        />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Completions Over Time
          </Typography>
          <LineChart
            xAxis={[{ scaleType: "point", data: data.lineDates }]}
            series={[{ data: data.lineCounts }]}
            width={500}
            height={300}
          />
        </Box>
      </Box>
    </Container>
  );
}
