/*
  Warnings:

  - Added the required column `player_1_score` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_2_score` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winner` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "player_1_score" INTEGER NOT NULL,
ADD COLUMN     "player_2_score" INTEGER NOT NULL,
ADD COLUMN     "winner" INTEGER NOT NULL;
