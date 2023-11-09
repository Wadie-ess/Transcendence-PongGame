/*
  Warnings:

  - You are about to drop the column `tfaStatus` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tfaToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "tfaStatus",
ADD COLUMN     "tfaToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_tfaToken_key" ON "users"("tfaToken");
