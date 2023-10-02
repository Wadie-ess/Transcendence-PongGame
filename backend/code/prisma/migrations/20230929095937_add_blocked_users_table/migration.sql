/*
  Warnings:

  - You are about to drop the column `blocked_by_id` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `is_blocked` on the `friends` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friends" DROP COLUMN "blocked_by_id",
DROP COLUMN "is_blocked";

-- CreateTable
CREATE TABLE "blocked_friends" (
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "blocked_by_id" TEXT NOT NULL,
    "blocked_id" TEXT NOT NULL,

    CONSTRAINT "blocked_friends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blocked_friends_blocked_by_id_key" ON "blocked_friends"("blocked_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_friends_blocked_id_key" ON "blocked_friends"("blocked_id");

-- AddForeignKey
ALTER TABLE "blocked_friends" ADD CONSTRAINT "blocked_friends_blocked_by_id_fkey" FOREIGN KEY ("blocked_by_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_friends" ADD CONSTRAINT "blocked_friends_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
