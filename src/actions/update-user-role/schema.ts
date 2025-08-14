import { z } from "zod";

export const updateUserRoleSchema = z.object({
  email: z.string().email(),
  role: z.enum(["user", "adm"]),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
