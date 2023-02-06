/*
  Warnings:

  - You are about to drop the column `description` on the `room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "room" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "room_details" ADD COLUMN     "description" TEXT;
