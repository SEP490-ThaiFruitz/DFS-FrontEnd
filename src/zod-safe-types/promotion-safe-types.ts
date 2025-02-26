import { z } from "zod";

export const RegisterGetDiscountSchemaTypes = z.object({
  registerEmail: z
    .string({
      message: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Invalid email",
    }),
});
