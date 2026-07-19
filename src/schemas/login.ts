import { z } from "zod";

export const userLoginSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export type UserLogin = z.infer<typeof userLoginSchema>;