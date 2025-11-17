import { userRouter } from "@/api/trpc/procedures/users.mjs";
import { privateProcedure, router, t } from "@/trpc.mjs";
import { z } from "zod";

export const appRouter = router({
    users: userRouter,

    checkPrivateRoute: privateProcedure.query(({ ctx }) => {
        console.log("🚗🚙🏎️🚗🚙🏎️🚗🚙🏎️🚗🚙🏎️🚗🚙🏎️");

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
