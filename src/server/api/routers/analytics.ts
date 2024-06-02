import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const analyticsRouter = createTRPCRouter({
  segment: publicProcedure.query(({ }) => {
    return {
      segmentWriteKey: env.SEGMENT_ANALYTICS_WRITE_KEY,
    };
  }),
});
