/*
  Warnings:

  - You are about to drop the column `hash` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hash",
ADD COLUMN     "intra_id" INTEGER,
ADD COLUMN     "intra_url" TEXT,
ALTER COLUMN "avatar_url" DROP DEFAULT;
