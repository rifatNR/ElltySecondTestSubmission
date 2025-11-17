import { privateProcedure, publicProcedure, router } from "@/trpc.mjs";
import { z } from "zod";
import { mapErrorToTRPCError } from "@/utils/trpcError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSchema = z.object({
    id: z.string(),
    username: z.string().min(1, { message: "Name is required." }).max(100, {
        message: "Name cannot exceed 100 characters.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});
export const PublicUserSchema = userSchema.omit({ password: true });

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

const verifyPassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
};

const generateToken = (payload: z.infer<typeof PublicUserSchema>) => {
    const secretKey = "localghost";
    return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

export const userRouter = router({
    list: privateProcedure
        .output(
            z.object({
                message: z.string(),
                users: z.array(PublicUserSchema),
            })
        )
        .query(async ({ ctx }) => {
            try {
                let query = `
                    SELECT id, username
                    FROM users
                `;
                const result = await ctx.psql.query(query);

                return {
                    message: "Users fetched successfully.",
                    users: result.rows,
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),
    login: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
            })
        )
        .output(
            z.object({
                message: z.string(),
                user: PublicUserSchema,
                token: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { username, password } = input;

            try {
                const userResult = await ctx.psql.query(
                    `
                    SELECT id, username, password AS hashed_password
                    FROM users
                    WHERE username = $1
                    LIMIT 1
                `,
                    [username]
                );

                if (userResult.rows.length === 0) {
                    throw new Error("Invalid username or password.");
                }

                const user = userResult.rows[0];

                const isPasswordValid = await verifyPassword(
                    password,
                    user.hashed_password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid username or password.");
                }

                const userForToken = {
                    id: user.id,
                    username: user.username,
                };

                const token = generateToken(userForToken);

                return {
                    message: "Login successful.",
                    user: userForToken,
                    token,
                };
            } catch (error) {
                throw mapErrorToTRPCError(
                    error,
                    "Failed to log in. Please check your credentials and try again."
                );
            }
        }),

    signup: publicProcedure
        .input(userSchema.omit({ id: true }))
        .output(
            z.object({
                message: z.string(),
                user: PublicUserSchema,
                token: z.string(),
                // token: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { username, password } = input;

            try {
                const hashedPassword = await hashPassword(password);

                const existingUser = await ctx.psql.query(
                    `
                    SELECT username
                    FROM users
                    WHERE username = $1
                    LIMIT 1
                    `,
                    [username]
                );

                if (existingUser.rows.length > 0) {
                    throw new Error(`User already exists.`);
                }

                const result = await ctx.psql.query(
                    `
                    INSERT INTO users (username, password, created_at, updated_at)
                    VALUES ($1, $2, NOW(), NOW())
                    RETURNING id, username, password AS hashedPassword
                    `,
                    [username, hashedPassword]
                );

                const user = {
                    id: result.rows[0].id,
                    username: result.rows[0].username,
                };

                const token = generateToken(user);

                return {
                    message: "User registered successfully.",
                    user,
                    token,
                };
            } catch (error) {
                throw mapErrorToTRPCError(
                    error,
                    "Failed to register user. Please try again."
                );
            }
        }),

    syncUser: publicProcedure
        .output(z.object({ message: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                // This procedure does nothing.
                return {
                    message: "User synced",
                };
            } catch (error) {
                throw mapErrorToTRPCError(error);
            }
        }),
});
