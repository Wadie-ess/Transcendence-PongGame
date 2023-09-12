/*
  Warnings:

  - A unique constraint covering the columns `[UUId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UUId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "UUId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_UUId_key" ON "users"("UUId");
