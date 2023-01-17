/*
  Warnings:

  - You are about to drop the `room_password` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "room_password" DROP CONSTRAINT "room_password_room_id_fkey";

-- DropTable
DROP TABLE "room_password";

-- CreateTable
CREATE TABLE "room_rules" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "rule" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_rules" ADD CONSTRAINT "room_rules_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
