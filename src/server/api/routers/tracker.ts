import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { trackers } from "@/server/db/schema";
import { TrackerSchema } from "@/server/helpers/trackerValidator";
import { eq } from "drizzle-orm";

export const trackerRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}, from trackers api!`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  create: protectedProcedure
    .input(TrackerSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(trackers).values({
        monitoredById: ctx.session.user.id,
        ...input,
      });
    }),

  update: protectedProcedure
    .input(
      TrackerSchema.merge(
        z.object({
          id: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input: { id, ...tracker } }) => {
      await ctx.db
        .update(trackers)
        .set({
          ...tracker,
        })
        .where(eq(trackers.id, id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(trackers).where(eq(trackers.id, id));
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(trackers);
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.trackers.findFirst({
      orderBy: (trackers, { desc }) => [desc(trackers.createdAt)],
    });
  }),
});
