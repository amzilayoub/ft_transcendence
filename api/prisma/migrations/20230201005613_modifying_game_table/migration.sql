/*
  Warnings:

  - You are about to drop the column `blocked_user_id` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `games` table. All the data in the column will be lost.
  - Added the required column `player_1` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_2` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_blocked_user_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_user_id_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "blocked_user_id",
DROP COLUMN "user_id",
ADD COLUMN     "player_1" INTEGER NOT NULL,
ADD COLUMN     "player_2" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_1_fkey" FOREIGN KEY ("player_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_2_fkey" FOREIGN KEY ("player_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
