import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createUser } from "@/lib/user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z
          .string()
          .min(6, "Password must contain at least 6 characters"),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const user = await createUser(input.email, input.password, input.name);
        return {
          success: true,
          message: "User created successfully",
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "User with this email already exists"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      };
    }),
});
