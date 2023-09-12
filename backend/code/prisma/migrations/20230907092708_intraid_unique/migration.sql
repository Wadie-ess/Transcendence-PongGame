/*
  Warnings:

  - A unique constraint covering the columns `[intraId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_intraId_key" ON "users"("intraId");
