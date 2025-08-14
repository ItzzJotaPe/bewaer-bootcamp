import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateUserRole(email: string, role: "user" | "adm") {
  try {
    const result = await db
      .update(userTable)
      .set({ role })
      .where(eq(userTable.email, email))
      .returning();

    return { success: true, user: result[0] };
  } catch (error) {
    return { success: false, error: "Failed to update user role" };
  }
}
