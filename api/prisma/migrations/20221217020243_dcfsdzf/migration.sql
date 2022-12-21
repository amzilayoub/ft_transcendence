/*
  Warnings:

  - You are about to drop the column `owner_id` on the `room` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "room" DROP CONSTRAINT "room_owner_id_fkey";

-- AlterTable
ALTER TABLE "room" DROP COLUMN "owner_id";
