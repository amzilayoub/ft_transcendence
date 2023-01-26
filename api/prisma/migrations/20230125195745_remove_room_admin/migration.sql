/*
  Warnings:

  - You are about to drop the `room_admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "room_admin" DROP CONSTRAINT "room_admin_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_admin" DROP CONSTRAINT "room_admin_user_id_fkey";

-- DropTable
DROP TABLE "room_admin";
