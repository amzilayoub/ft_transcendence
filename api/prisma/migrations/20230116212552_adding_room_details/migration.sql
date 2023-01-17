/*
  Warnings:

  - You are about to drop the `room_name` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "room_name" DROP CONSTRAINT "room_name_room_id_fkey";

-- DropTable
DROP TABLE "room_name";

-- CreateTable
CREATE TABLE "room_details" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_details" ADD CONSTRAINT "room_details_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
