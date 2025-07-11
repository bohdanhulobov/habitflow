import { publicProcedure, createTRPCRouter } from "../trpc";
import { prisma } from "@/lib/prisma";

export const statisticsRouter = createTRPCRouter({
  getStatistics: publicProcedure.query(async () => {
    // Fetch all habits and their logs
    const habits = await prisma.habit.findMany({
      include: { logs: true },
    });
    const habitData = habits.map((habit) => ({
      habit: habit.title,
      count: habit.logs.length,
    }));

    // Line chart data: completions per day (for all habits)
    const logs = await prisma.habitLog.findMany();
    const logMap: Record<string, number> = {};
    logs.forEach((log) => {
      const date = log.date.toISOString().slice(0, 10);
      logMap[date] = (logMap[date] || 0) + log.value;
    });
    const lineDates = Object.keys(logMap).sort();
    const lineCounts = lineDates.map((date) => logMap[date]);

    function getStreaksAndMissed(
      logs: Array<{ date: Date; value: number }>,
      days = 30,
    ) {
      // Build a map of date strings to value
      const dateMap = new Map<string, number>();
      logs.forEach((log: { date: Date; value: number }) => {
        dateMap.set(log.date.toISOString().slice(0, 10), log.value);
      });
      let currentStreak = 0;
      let longestStreak = 0;
      let streak = 0;
      const missedDays: { date: string }[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const v = dateMap.get(key);
        if (v && v > 0) {
          streak++;
          if (streak > longestStreak) longestStreak = streak;
        } else {
          missedDays.push({ date: key });
          streak = 0;
        }
        if (i === 0) currentStreak = streak;
      }
      return { currentStreak, longestStreak, missedDays };
    }

    // Calculate stats for each habit
    const streaks = [];
    const consistency = [];
    const missedDaysArr = [];
    const progress = [];
    const motivationTrendMap: Record<
      string,
      { completed: number; total: number }
    > = {};
    for (const habit of habits) {
      // Only last 30 days
      const last30 = habit.logs.filter((log) => {
        const diff =
          (new Date().getTime() - log.date.getTime()) / (1000 * 60 * 60 * 24);
        return diff < 30;
      });
      const { currentStreak, longestStreak, missedDays } = getStreaksAndMissed(
        last30,
        30,
      );
      streaks.push({ habit: habit.title, currentStreak, longestStreak });
      missedDaysArr.push({ habit: habit.title, missedDays });
      // Consistency
      const completed = last30.filter((log) => log.value > 0).length;
      const missed = 30 - completed - missedDays.length;
      const rate = completed / 30;
      consistency.push({ habit: habit.title, completed, missed, rate });
      // Progress
      progress.push({ habit: habit.title, progress: completed, target: 30 });
      // Motivation trend (daily rate)
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const log = last30.find(
          (l) => l.date.toISOString().slice(0, 10) === key,
        );
        if (!motivationTrendMap[key])
          motivationTrendMap[key] = { completed: 0, total: 0 };
        motivationTrendMap[key].total++;
        if (log && log.value > 0) motivationTrendMap[key].completed++;
      }
    }
    // Motivation trend: array of {date, rate}
    const motivationTrend = Object.keys(motivationTrendMap)
      .sort()
      .map((date) => ({
        date,
        rate:
          motivationTrendMap[date].completed / motivationTrendMap[date].total,
      }));

    return {
      habitData,
      lineDates,
      lineCounts,
      streaks,
      consistency,
      motivationTrend,
      missedDays: missedDaysArr,
      progress,
    };
  }),
});
