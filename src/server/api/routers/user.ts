import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure.query(({ }) => {
    return {
      greeting: "Hello, from example!",
    };
  }),
  receiveToken: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .query(async ({ ctx: { db }, input: { sessionToken } }) => {
      const session = await db.query.sessions.findFirst({
        where: (sessionTokens, { eq }) => eq(sessionTokens.sessionToken, sessionToken),
      });

      if (!session) {
        return {
          msg: `SESSIONTOKEN: ${sessionToken} doesn't exist.`,
        }
      }
      return {
        msg: `SESSIONTOKEN: ${sessionToken} exist.`,
      }
    })
});
