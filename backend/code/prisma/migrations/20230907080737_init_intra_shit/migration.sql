/*
  Warnings:

  - Added the required column `intraId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intraUsername` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "intraId" TEXT NOT NULL,
ADD COLUMN     "intraUsername" TEXT NOT NULL;
