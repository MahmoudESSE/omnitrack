import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { groups, members } from "@/server/db/schema";
import { count, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const MemberFormSchema = z.object({
  email: z.string().email(),
});

export const groupsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(MemberFormSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email;
      const res = await ctx.db
        .select({
          group: groups.id,
          owner: groups.ownerId,
          count: count(groups.id),
        })
        .from(groups)
        .where((grp) => eq(grp.owner, userId))
        .groupBy(groups.ownerId, groups.id);
      console.log(res);

      if (res.length === 0 || (res[0] && res[0].count === 0)) {
        const insertedGroups = await ctx.db
          .insert(groups)
          .values({ ownerId: userId })
          .returning({ insertedId: groups.id });
        console.log(insertedGroups);

        if (!insertedGroups?.[0] || !userEmail) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        await ctx.db.insert(members).values({
          groupId: insertedGroups[0].insertedId,
          member_email: userEmail,
        });
        await ctx.db.insert(members).values({
          groupId: insertedGroups[0].insertedId,
          member_email: input.email,
        });
        return;
      }

      if (!res?.[0]?.group) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      await ctx.db
        .insert(members)
        .values({ groupId: res[0].group, member_email: input.email });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const res = await ctx.db.query.groups.findFirst({
      where: (grp, { eq }) => eq(grp.ownerId, userId),
    });
    if (!res) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `could not find any group for the user: ${ctx.session.user.name}`,
      });
    }

    return ctx.db
      .select()
      .from(members)
      .where((m) => eq(m.groupId, res.id));
  }),

  delete: protectedProcedure
    .input(
      z.object({
        member_email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input: { member_email } }) => {
      await ctx.db.delete(members).where(eq(members.member_email, member_email));
    }),
});
