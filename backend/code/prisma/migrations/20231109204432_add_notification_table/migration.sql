/*
  Warnings:

  - You are about to drop the column `content` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `actorId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotifType" ADD VALUE 'acceptFriend';
ALTER TYPE "NotifType" ADD VALUE 'message';

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "content",
DROP COLUMN "readAt",
DROP COLUMN "recipientId",
ADD COLUMN     "actorId" TEXT NOT NULL,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entity_type" TEXT,
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "type" "NotifType" NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
