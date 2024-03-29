/*
  Warnings:

  - You are about to drop the `glyphwikis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "glyphwikis";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "glyphwiki" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "related" TEXT,
    "data" TEXT NOT NULL
);
