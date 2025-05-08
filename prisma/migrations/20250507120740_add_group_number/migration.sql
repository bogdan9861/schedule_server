-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "groupNumber" INTEGER NOT NULL DEFAULT 1,
    "role" TEXT NOT NULL,
    "groupId" INTEGER,
    CONSTRAINT "users_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("groupId", "id", "login", "name", "password", "role") SELECT "groupId", "id", "login", "name", "password", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
