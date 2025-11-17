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
export const nodeWithUsersSchema = nodeSchema.extend({
    user_username: z.string(),
});

export const nodeRouter = router({
    list: publicProcedure
        .output(
            z.object({
                message: z.string(),
                nodes: z.array(nodeWithUsersSchema),
            })
        )
        .query(async ({ ctx }) => {
            try {
                const result = await ctx.psql.query(
                    `SELECT 
                        n.id,
                        n.parent_id,
                        n.user_id,
                        u.username AS user_username,
                        n.operation,
                        n.right_value::float,
                        n.result_value::float,
                        n.created_at
                    FROM nodes n
                    LEFT JOIN users u ON n.user_id = u.id
                    ORDER BY n.created_at ASC`
                );

                return {
                    message: "Nodes fetched successfully.",
                    nodes: result.rows,
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
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.psql.query(
                    `INSERT INTO nodes (user_id, result_value)
                     VALUES ($1, $2)
                     RETURNING id, parent_id, user_id, operation, right_value::float, result_value::float, created_at`,
                    [ctx.user.id, input.right_value]
                );

                return {
                    message: "Node created successfully.",
                    node: result.rows[0],
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),

    operateNode: privateProcedure
        .input(
            z.object({
                parent_id: z.string().uuid(),
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
        .mutation(async ({ ctx, input }) => {
            try {
                let result_value: number;

                const parentResult = await ctx.psql.query(
                    `SELECT result_value::float FROM nodes WHERE id = $1`,
                    [input.parent_id]
                );

                if (parentResult.rows.length === 0) {
                    throw new Error("Parent node not found");
                }

                const parent = parentResult.rows[0];
                const parentResultValue = parent.result_value;

                switch (input.operation) {
                    case "+":
                        result_value = parentResultValue + input.right_value;
                        break;
                    case "-":
                        result_value = parentResultValue - input.right_value;
                        break;
                    case "*":
                        result_value = parentResultValue * input.right_value;
                        break;
                    case "/":
                        if (input.right_value === 0) {
                            throw new Error("Cannot divide by zero.");
                        }
                        result_value = parentResultValue / input.right_value;
                        break;
                }

                const result = await ctx.psql.query(
                    `INSERT INTO nodes (parent_id, user_id, operation, right_value, result_value)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING id, parent_id, user_id, operation, right_value::float, result_value::float, created_at`,
                    [
                        input.parent_id,
                        ctx.user.id,
                        input.operation,
                        input.right_value,
                        result_value,
                    ]
                );

                return {
                    message: "Operation completed successfully.",
                    node: result.rows[0],
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),
});
