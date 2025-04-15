import { z } from "zod";

const emailSchema = z
    .string()
    .email("Invalid email");

export const loginFormSchema = z.object({
    email: emailSchema,
    password: z
        .string()
        .min(1, "Password is required"),
});

export const registerFormSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),
    email: emailSchema,
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(32, "Password must be at most 32 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/\d/, "Password must contain at least one number.")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
    termsOfService: z
        .literal(true, {
            errorMap: () => ({
                message: "You must accept the Terms of Service to continue",
            }),
        }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
