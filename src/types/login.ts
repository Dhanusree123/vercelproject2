import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});
export type ILogin = z.infer<typeof LoginSchema>;