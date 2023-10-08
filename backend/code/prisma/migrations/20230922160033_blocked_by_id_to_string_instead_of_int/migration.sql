/*
  Warnings:

  - A unique constraint covering the columns `[fromId,toId]` on the table `friends` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "friends" ALTER COLUMN "is_blocked" SET DEFAULT false,
ALTER COLUMN "blocked_by_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "friends_fromId_toId_key" ON "friends"("fromId", "toId");
