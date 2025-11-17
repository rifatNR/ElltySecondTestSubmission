import { Context } from "@/context.mjs";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";

export const t = initTRPC.context<Context>().create({
    errorFormatter(opts) {
        const { shape, error } = opts;
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === "BAD_REQUEST" &&
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const publicProcedure = t.procedure;

export const privateProcedure = publicProcedure.use(async (opts) => {
    const { ctx } = opts;

    const authorization = ctx.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "No Bearer token provided",
        });
    }

    const token = authorization.split(" ")[1];

    if (
        !token ||
        token.trim() === "" ||
        token === "undefined" ||
        token === "null"
    ) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Bearer token empty",
        });
    }

    let decodedToken: JwtPayload | string;

    try {
        decodedToken = jwt.verify(token, "localghost");
    } catch (error) {
        if (error instanceof Error) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message:
                    error.name === "TokenExpiredError"
                        ? "Token has expired!"
                        : "Invalid token!",
            });
        }
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "An unknown error occurred during token verification",
        });
    }

    const { id, username } = decodedToken as JwtPayload;

    if (!id || !username) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
        });
    }

    return opts.next({
        ctx: {
            token: token,
            user: {
                id,
                username,
            },
        },
    });
});

export const router = t.router;
