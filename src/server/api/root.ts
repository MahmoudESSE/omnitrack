import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { trackerRouter } from "./routers/tracker";
import { historyRouter } from "./routers/history";
import { exampleRouter } from "./routers/example";
import { mapRouter } from "./routers/map";
import { analyticsRouter } from "./routers/analytics";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  tracker: trackerRouter,
  hitory: historyRouter,
  example: exampleRouter,
  map: mapRouter,
  segment: analyticsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
