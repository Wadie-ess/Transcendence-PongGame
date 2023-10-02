/*
  Warnings:

  - A unique constraint covering the columns `[userId,roomId]` on the table `room_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "room_members_userId_roomId_key" ON "room_members"("userId", "roomId");
