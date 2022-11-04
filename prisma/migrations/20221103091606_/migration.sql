/*
  Warnings:

  - You are about to drop the column `hastRefreshToken` on the `users` table. All the data in the column will be lost.
  - Added the required column `hashRefreshToken` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashRefreshToken" TEXT NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "hash", "id", "updatedAt") SELECT "createdAt", "email", "hash", "id", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
