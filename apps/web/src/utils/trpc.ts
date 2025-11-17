import type { AppRouter } from "@ellty/core";
import { createTRPCReact, TRPCClientError } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpcErrorHandler = (error: unknown, cb?: () => void): string => {
    if (error instanceof TRPCClientError) {
        // Handle Unauthorized errors
        if (error.data?.code === "UNAUTHORIZED") {
            cb?.();
            return "You are not authorized. Please login.";
        }

        // Handle Zod validation errors
        if (error.data?.zodError) {
            const fieldErrors = error.data.zodError.fieldErrors;
            const firstError = (Object.values(fieldErrors)[0] as any)?.[0];
            return firstError ?? "Unexpected zod error.";
        }

        // Other tRPC errors
        return error.message ?? "Unexpected tRPC error.";
    }

    // Fallback for non-tRPC errors
    return "Unexpected error occurred.";
};
