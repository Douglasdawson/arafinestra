import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { users } from "@shared/schema";

async function seed() {
  const hash = await bcrypt.hash("admin", 10);

  await db
    .insert(users)
    .values({ username: "admin", password: hash })
    .onConflictDoNothing({ target: users.username });

  console.log("Seed complete: admin user created (or already exists)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
