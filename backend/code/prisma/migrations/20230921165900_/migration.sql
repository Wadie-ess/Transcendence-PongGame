-- DropForeignKey
ALTER TABLE "room_members" DROP CONSTRAINT "room_members_roomId_fkey";

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
