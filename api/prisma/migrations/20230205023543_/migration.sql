/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nickname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");
