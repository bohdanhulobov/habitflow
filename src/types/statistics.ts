export type HabitData = { habit: string; count: number };
export type StreakData = {
  habit: string;
  currentStreak: number;
  longestStreak: number;
};
export type ConsistencyData = {
  habit: string;
  completed: number;
  missed: number;
  rate: number;
};
export type MotivationTrendData = { date: string; rate: number };
export type MissedDaysData = { habit: string; missedDays: { date: string }[] };
export type ProgressData = { habit: string; progress: number; target: number };

export type StatisticsData = {
  habitData: HabitData[];
  lineDates: string[];
  lineCounts: number[];
  streaks: StreakData[];
  consistency: ConsistencyData[];
  motivationTrend: MotivationTrendData[];
  missedDays: MissedDaysData[];
  progress: ProgressData[];
};
