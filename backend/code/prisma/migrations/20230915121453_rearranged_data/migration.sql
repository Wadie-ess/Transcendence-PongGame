/*
  Warnings:

  - You are about to drop the column `UUId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_UUId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "UUId",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "profileFinished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tfaEnabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "intraId" DROP NOT NULL,
ALTER COLUMN "intraUsername" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
