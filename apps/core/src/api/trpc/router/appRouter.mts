import { nodeRouter } from "@/api/trpc/procedures/nodes.mjs";
import { userRouter } from "@/api/trpc/procedures/users.mjs";
import { privateProcedure, router, t } from "@/trpc.mjs";
import { z } from "zod";

export const appRouter = router({
    users: userRouter,
    nodes: nodeRouter,

    checkPrivateRoute: privateProcedure.query(({ ctx }) => {
        return {
            authUset: ctx.user,
        };
    }),
    hello: t.procedure
        .input(z.object({ name: z.string().optional() }))
        .query(({ input }) => {
            return {
                message: `Hello, ${input.name ?? "----"}!`,
            };
        }),
    getTime: t.procedure.query(() => {
        return { time: new Date().toISOString() };
    }),
});

export type AppRouter = typeof appRouter;
