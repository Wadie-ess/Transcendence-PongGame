/*
  Warnings:

  - The primary key for the `friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `room_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "RoomType" ADD VALUE 'dm';

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_fromId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_toId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_participant1Id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_members" DROP CONSTRAINT "room_members_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_members" DROP CONSTRAINT "room_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_ownerId_fkey";

-- DropIndex
DROP INDEX "users_id_key";

-- AlterTable
ALTER TABLE "friends" DROP CONSTRAINT "friends_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "fromId" SET DATA TYPE TEXT,
ALTER COLUMN "toId" SET DATA TYPE TEXT,
ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "friends_id_seq";

-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "participant1Id" SET DATA TYPE TEXT,
ALTER COLUMN "participant2Id" SET DATA TYPE TEXT,
ALTER COLUMN "winner_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "roomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "messages_id_seq";

-- AlterTable
ALTER TABLE "room_members" DROP CONSTRAINT "room_members_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "roomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "room_members_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "room_members_id_seq";

-- AlterTable
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "rooms_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");
DROP SEQUENCE "users_userId_seq";

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_toId_fkey" FOREIGN KEY ("toId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
