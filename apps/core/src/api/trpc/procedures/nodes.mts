import { privateProcedure, publicProcedure, router } from "@/trpc.mjs";
import { z } from "zod";
import { mapErrorToTRPCError } from "@/utils/trpcError.js";

export const nodeSchema = z.object({
    id: z.string().uuid(),
    parent_id: z.string().uuid().nullable(),
    user_id: z.string().uuid(),
    operation: z.enum(["+", "-", "*", "/"]).nullable(),
    right_value: z.number().nullable(),
    result_value: z.number(),
    created_at: z.coerce.date(),
});

export const nodeRouter = router({
    list: publicProcedure
        .output(
            z.object({
                message: z.string(),
                nodes: z.array(nodeSchema),
            })
        )
        .query(async ({ ctx }) => {
            try {
                // ctx.psql contains the PostgreSQL instance
                // list all nodes

                return {
                    message: "Nodes fetched successfully.",
                    nodes: [],
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),

    createNode: privateProcedure
        .input(
            z.object({
                right_value: z.number(),
            })
        )
        .output(
            z.object({
                message: z.string(),
                node: nodeSchema,
            })
        )
        .output(z.object({ message: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                // Add a new node
                return {
                    message: "User synced",
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),

    operateNode: privateProcedure
        .input(
            z.object({
                parent_id: z.string().uuid().nullable(),
                operation: z.enum(["+", "-", "*", "/"]),
                right_value: z.number(),
            })
        )
        .output(
            z.object({
                message: z.string(),
                node: nodeSchema,
            })
        )
        .output(z.object({ message: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                // Operate on a node
                return {
                    message: "User synced",
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),
});
