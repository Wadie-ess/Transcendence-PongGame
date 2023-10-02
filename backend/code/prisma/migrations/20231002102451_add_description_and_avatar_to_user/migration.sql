/*
  Warnings:

  - You are about to drop the column `intraUsername` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "intraUsername",
ADD COLUMN     "Username" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "discreption" TEXT NOT NULL DEFAULT '';
