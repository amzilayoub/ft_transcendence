-- DropForeignKey
ALTER TABLE "blacklist" DROP CONSTRAINT "blacklist_blocked_user_id_fkey";

-- DropForeignKey
ALTER TABLE "blacklist" DROP CONSTRAINT "blacklist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_user_id_1_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_user_id_2_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_room_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "room" DROP CONSTRAINT "room_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "room" DROP CONSTRAINT "room_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "room_user_rel" DROP CONSTRAINT "room_user_rel_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_user_rel" DROP CONSTRAINT "room_user_rel_user_id_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "room" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "room_user_rel" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_user_rel" ADD CONSTRAINT "room_user_rel_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_user_rel" ADD CONSTRAINT "room_user_rel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blacklist" ADD CONSTRAINT "blacklist_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
