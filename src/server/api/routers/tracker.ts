import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { groups, trackers } from "@/server/db/schema";
import { TrackerSchema } from "@/server/helpers/trackerValidator";
import { desc, eq, gt } from "drizzle-orm";
import { throws } from "assert";
import { TRPCError } from "@trpc/server";

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

  connectMe: publicProcedure
    .input(TrackerSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, "mahmoudessehayli@gmail.com"),
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "no default user",
        });
      }

      const monitoredBy = await ctx.db.query.groups.findFirst({
        where: (groups, { eq }) => eq(groups.ownerId, user.id),
      });

      if (!monitoredBy) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "default user group not found",
        });
      }

      await ctx.db.insert(trackers).values({
        monitoredById: monitoredBy.id,
        ...input,
      });
    }),

  create: protectedProcedure
    .input(TrackerSchema)
    .mutation(async ({ ctx, input }) => {
      const monitoredBy = await ctx.db.query.groups.findFirst({
        where: (groups, { eq }) => eq(groups.ownerId, ctx.session.user.id),
      });

      if (!monitoredBy) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "default user group not found",
        });
      }

      await ctx.db.insert(trackers).values({
        monitoredById: monitoredBy.id,

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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user || !ctx.session.user.email) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "user email not found",
      });
    }

    const member_email = ctx.session.user.email;

    const monitoredBy = await ctx.db.query.members.findFirst({
      where: (members, { eq }) => eq(members.member_email, member_email),
    });

    if (!monitoredBy) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "default user group not found",
      });
    }

    return await ctx.db.query.trackers.findMany({
      where: (trackers, { eq }) =>
        eq(trackers.monitoredById, monitoredBy.groupId),
    });
  }),

  getAllDistinct: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user || !ctx.session.user.email) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "user email not found",
      });
    }

    const member_email = ctx.session.user.email;

    const monitoredBy = await ctx.db.query.members.findFirst({
      where: (members, { eq }) => eq(members.member_email, member_email),
    });

    if (!monitoredBy) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "default user group not found",
      });
    }

    return await ctx.db.selectDistinctOn([trackers.name]).from(trackers)
      .where((t) => eq(t.monitoredById, monitoredBy.groupId));

  }),

  getAllSpeedBarier: protectedProcedure.input(z.object({
    speed: z.coerce.number().default(0.1).optional(),
  })).query(async ({ ctx }) => {
    if (!ctx.session.user || !ctx.session.user.email) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "user email not found",
      });
    }

    const member_email = ctx.session.user.email;

    const monitoredBy = await ctx.db.query.members.findFirst({
      where: (members, { eq }) => eq(members.member_email, member_email),
    });

    if (!monitoredBy) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "default user group not found",
      });
    }

    return await ctx.db.selectDistinctOn([trackers.name]).from(trackers)
      .where((t) => eq(t.monitoredById, monitoredBy.groupId) && gt(t.speed, 0.4));
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.trackers.findFirst({
      orderBy: (trackers, { desc }) => [desc(trackers.createdAt)],
    });
  }),

  searchFor: protectedProcedure
    .input(
      z.object({
        tracker: TrackerSchema,
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.trackers.findFirst({
        where: (tracker, { eq }) => eq(tracker.imei, input.tracker.imei),
      });
    }),
});
