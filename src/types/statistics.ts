export type HabitData = { habit: string; count: number };
export type StatisticsData = {
  habitData: HabitData[];
  lineDates: string[];
  lineCounts: number[];
};
