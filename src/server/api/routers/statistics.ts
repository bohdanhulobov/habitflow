import { publicProcedure, createTRPCRouter } from "../trpc";
import { prisma } from "@/lib/prisma";

export const statisticsRouter = createTRPCRouter({
  getStatistics: publicProcedure.query(async () => {
    // Fetch all habits and their completion counts
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

    return {
      habitData,
      lineDates,
      lineCounts,
    };
  }),
});
