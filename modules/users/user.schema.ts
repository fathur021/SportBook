import { z } from "zod";

export const USER_ROLES = ["ADMIN", "USER"] as const;
export const userListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: z.enum(USER_ROLES).optional(),
});

export const userIdSchema = z.string().trim().min(1,"User ID tidak boleh kosong")
export const updateUserRoleSchema = z.object({
    role: z.enum(USER_ROLES, { error: "Role tidak valid" }),
})

export type UserListQuery = z.infer<typeof userListQuerySchema>;