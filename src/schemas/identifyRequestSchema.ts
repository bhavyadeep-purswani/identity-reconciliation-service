import { z } from "zod";

export const identifyRequestSchema = z.object({
    email: z.string().email("Invalid Email!").optional(),
    phoneNumber: z.string().regex(/^\d+$/, "Invalid Phone Number!").optional(),
}).refine((data) => data.email || data.phoneNumber, {
    message: "At least one of email or phone must be provided",
    path: ["email", "phoneNumber"],
});