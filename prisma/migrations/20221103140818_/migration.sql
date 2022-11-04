/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `glyphwiki` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "glyphwiki_name_key" ON "glyphwiki"("name");
