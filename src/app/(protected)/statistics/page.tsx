"use client";
import { Container, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { api } from "@/components/providers/TRPCProvider";
import type { StatisticsData, HabitData } from "@/types/statistics";
import Loader from "@/components/ui/molecules/Loader";
import PageHeader from "@/components/ui/organisms/PageHeader";

export default function StatisticsPage() {
  const { data, isLoading, error } =
    api.statistics.getStatistics.useQuery<StatisticsData>();

  if (isLoading) {
    return <Loader wording="Loading statistics..." />;
  }
  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Error loading statistics.</Typography>
      </Container>
    );
  }

  const streaks = data.streaks;
  const consistency = data.consistency;
  const motivationTrend = data.motivationTrend;
  const missedDays = data.missedDays;
  const progress = data.progress;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <PageHeader title="Statistics" />
        {/* Progress Toward Monthly Goal */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Progress Toward Monthly Goal
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {progress.map((p) => (
              <Box
                key={p.habit}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  minWidth: 200,
                }}
              >
                <Typography variant="subtitle1">{p.habit}</Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 20,
                    bgcolor: "#eee",
                    borderRadius: 1,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: `${Math.min(100, (p.progress / p.target) * 100)}%`,
                      height: "100%",
                      bgcolor: "primary.main",
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {p.progress} / {p.target}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Current Streak Indicator */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Streaks
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {streaks.map((s) => (
              <Box
                key={s.habit}
                sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}
              >
                <Typography variant="subtitle1">{s.habit}</Typography>
                <Typography variant="h5">{s.currentStreak} days</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Streaks Bar Chart */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Longest Streaks
          </Typography>
          <BarChart
            xAxis={[{ scaleType: "band", data: streaks.map((s) => s.habit) }]}
            series={[
              {
                data: streaks.map((s) => s.longestStreak),
                label: "Longest Streak",
              },
            ]}
            width={500}
            height={200}
          />
        </Box>
        {/* Monthly Consistency Rate Pie Chart */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Consistency Rate
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {consistency.map((c) => (
              <Box
                key={c.habit}
                sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}
              >
                <Typography variant="subtitle1">{c.habit}</Typography>
                <Typography variant="body2">
                  Completed: {c.completed}
                </Typography>
                <Typography variant="body2">Missed: {c.missed}</Typography>
                <Typography variant="body2">
                  Rate: {(c.rate * 100).toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Motivation Trend Line Chart */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Motivation Trend
          </Typography>
          <LineChart
            xAxis={[
              { scaleType: "point", data: motivationTrend.map((m) => m.date) },
            ]}
            series={[
              {
                data: motivationTrend.map((m) => m.rate),
                label: "Consistency Rate",
              },
            ]}
            width={500}
            height={200}
          />
        </Box>
        {/* Habit Completion Bar Chart */}
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
        {/* Completions Over Time Line Chart */}
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
        {/* Missed Days Breakdown */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Missed Days Breakdown
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {missedDays.map((m) => (
              <Box
                key={m.habit}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  minWidth: 220,
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {m.habit}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {m.missedDays.length === 0 ? (
                    <Typography variant="body2" color="success.main">
                      No missed days 🎉
                    </Typography>
                  ) : (
                    <>
                      <Typography
                        variant="body2"
                        color="info.main"
                        sx={{ fontWeight: 500 }}
                      >
                        {m.missedDays.length} missed:
                      </Typography>
                      {m.missedDays.map((d) => (
                        <Box
                          key={d.date}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: "info.light",
                            color: "info.dark",
                            borderRadius: 2,
                            fontSize: 13,
                            fontWeight: 500,
                            letterSpacing: 0.2,
                          }}
                        >
                          {d.date}
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
