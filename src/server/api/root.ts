import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { habitRouter } from "./routers/habit";
import { statisticsRouter } from "./routers/statistics";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  habit: habitRouter,
  statistics: statisticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
