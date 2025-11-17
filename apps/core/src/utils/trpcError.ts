import { TRPCError } from "@trpc/server";

export const mapErrorToTRPCError = (error: unknown, defaultErrMsg?: string) => {
    console.error("Error saving idea:", error);

    // Database-specific error handling
    if (error instanceof Error && error.message.includes("duplicate key")) {
        return new TRPCError({
            code: "CONFLICT",
            message: "duplicate key",
            cause: error,
        });
    }

    // Network or connection errors
    if (error instanceof Error && error.message.includes("network")) {
        return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Network error occurred",
            cause: error,
        });
    }

    // Generic error fallback
    if (error instanceof Error) {
        return new TRPCError({
            code: "BAD_REQUEST",
            message: error.message || "An unexpected error occurred",
            cause: error,
        });
    }

    // Completely unknown error type
    if (defaultErrMsg) {
        return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultErrMsg,
            cause: error,
        });
    } else {
        return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unhandled error occurred",
            cause: error,
        });
    }
};
