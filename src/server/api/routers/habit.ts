import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Frequency } from "@prisma/client";

export const habitRouter = createTRPCRouter({
  // Get all user habits
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const habits = await ctx.prisma.habit.findMany({
      where: {
        userId: ctx.session.user.id,
        isActive: true,
      },
      include: {
        logs: {
          where: {
            date: new Date(),
          },
        },
        _count: {
          select: {
            logs: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return habits;
  }),

  // Get habit by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const habit = await ctx.prisma.habit.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          logs: {
            orderBy: {
              date: "desc",
            },
            take: 30, // Last 30 records
          },
        },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      return habit;
    }),

  // Create new habit
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Habit title is required"),
        description: z.string().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        frequency: z.enum(Frequency).optional(),
        targetValue: z.number().min(1).optional(),
        unit: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const habit = await ctx.prisma.habit.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
        include: {
          logs: {
            where: {
              date: new Date(),
            },
          },
        },
      });

      return {
        success: true,
        message: "Habit created successfully",
        habit,
      };
    }),

  // Update habit
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        frequency: z.enum(Frequency).optional(),
        targetValue: z.number().min(1).optional(),
        unit: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const habit = await ctx.prisma.habit.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: updateData,
        include: {
          logs: {
            where: {
              date: new Date(),
            },
          },
        },
      });

      return {
        success: true,
        message: "Habit updated successfully",
        habit,
      };
    }),

  // Delete habit (soft delete)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.habit.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          isActive: false,
        },
      });

      return {
        success: true,
        message: "Habit deleted successfully",
      };
    }),

  // Log habit completion
  logCompletion: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        date: z.date().optional(),
        value: z.number().min(0).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { habitId, date = new Date(), value = 1, notes } = input;

      // Verify habit belongs to user
      const habit = await ctx.prisma.habit.findFirst({
        where: {
          id: habitId,
          userId: ctx.session.user.id,
        },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      const habitLog = await ctx.prisma.habitLog.upsert({
        where: {
          habitId_date: {
            habitId,
            date,
          },
        },
        update: {
          value,
          notes,
        },
        create: {
          habitId,
          userId: ctx.session.user.id,
          date,
          value,
          notes,
        },
      });

      return {
        success: true,
        message: "Habit completion logged successfully",
        log: habitLog,
      };
    }),

  // Get habit statistics
  getStats: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        days: z.number().min(1).max(365).optional().default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { habitId, days } = input;

      // Verify habit belongs to user
      const habit = await ctx.prisma.habit.findFirst({
        where: {
          id: habitId,
          userId: ctx.session.user.id,
        },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await ctx.prisma.habitLog.findMany({
        where: {
          habitId,
          userId: ctx.session.user.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      });

      const totalDays = days;
      const completedDays = logs.length;
      const totalValue = logs.reduce((sum, log) => sum + log.value, 0);
      const averageValue = completedDays > 0 ? totalValue / completedDays : 0;

      // Calculate streak
      const sortedLogs = logs.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedLogs.length; i++) {
        const logDate = new Date(sortedLogs[i].date);
        logDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (logDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      return {
        totalDays,
        completedDays,
        totalValue,
        averageValue,
        streak,
        completionRate: (completedDays / totalDays) * 100,
        logs,
      };
    }),

  // Get today's habits overview
  getTodayOverview: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habits = await ctx.prisma.habit.findMany({
      where: {
        userId: ctx.session.user.id,
        isActive: true,
      },
      include: {
        logs: {
          where: {
            date: today,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const completed = habits.filter((habit) => habit.logs.length > 0).length;
    const total = habits.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      habits,
      completed,
      total,
      completionRate,
    };
  }),
});
