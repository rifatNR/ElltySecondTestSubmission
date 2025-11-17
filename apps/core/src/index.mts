import express, { Request, Response } from "express";
import { createContext } from "@/context.mjs";
import { appRouter } from "@/api/trpc/router/appRouter.mjs";
import * as trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import cors from "cors";

export type AppRouter = typeof appRouter;

const port = 3333;
const app = express();

const trpcApiEndpoint = "/trpc";
const playgroundEndpoint = "/trpc-playground";

app.use(express.json());
app.use(cors());
app.use(
    trpcApiEndpoint,
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

app.use(
    playgroundEndpoint,
    await expressHandler({
        trpcApiEndpoint,
        playgroundEndpoint,
        router: appRouter,
    })
);

app.get("/", async (req: Request, res: Response) => {
    res.json({
        msg: "ellty server is running...",
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
