/*
  Warnings:

  - A unique constraint covering the columns `[blocked_by_id,blocked_id]` on the table `blocked_friends` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "blocked_friends_blocked_by_id_key";

-- DropIndex
DROP INDEX "blocked_friends_blocked_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "blocked_friends_blocked_by_id_blocked_id_key" ON "blocked_friends"("blocked_by_id", "blocked_id");
