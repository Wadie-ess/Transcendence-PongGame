-- DropForeignKey
ALTER TABLE "blocked_friends" DROP CONSTRAINT "blocked_friends_blocked_by_id_fkey";

-- DropForeignKey
ALTER TABLE "blocked_friends" DROP CONSTRAINT "blocked_friends_blocked_id_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_fromId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_toId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_participant1Id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_participant2Id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_authorId_fkey";

-- DropForeignKey
ALTER TABLE "room_members" DROP CONSTRAINT "room_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_ownerId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_toId_fkey" FOREIGN KEY ("toId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_friends" ADD CONSTRAINT "blocked_friends_blocked_by_id_fkey" FOREIGN KEY ("blocked_by_id") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_friends" ADD CONSTRAINT "blocked_friends_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
