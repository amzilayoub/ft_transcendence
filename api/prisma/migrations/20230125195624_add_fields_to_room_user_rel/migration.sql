-- AlterTable
ALTER TABLE "room_user_rel" ADD COLUMN     "muted" BOOLEAN DEFAULT false,
ADD COLUMN     "role" TEXT DEFAULT 'Member';
