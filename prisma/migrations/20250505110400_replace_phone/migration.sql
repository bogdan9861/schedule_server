/*
  Warnings:

  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - Added the required column `login` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "users_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_users" ("groupId", "id", "name", "password", "role") SELECT "groupId", "id", "name", "password", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
