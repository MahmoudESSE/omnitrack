import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { histories } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const historyRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}, from hitory api!`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  create: protectedProcedure
    .input(
      z.object({
        createdById: z.number({ message: "id of tracker not provided" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(histories).values({
        ...input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        createdById: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { id, createdById } }) => {
      return await ctx.db
        .update(histories)
        .set({
          createdById: createdById,
        })
        .where(eq(histories.id, id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.db.delete(histories).where(eq(histories.id, id));
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(histories);
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.histories.findFirst({
      orderBy: (histories, { desc }) => [desc(histories.savedAt)],
    });
  }),
});
