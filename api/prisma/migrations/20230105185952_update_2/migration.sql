-- AlterTable
ALTER TABLE "users" ADD COLUMN     "TwoFactorSecret" TEXT,
ADD COLUMN     "isTwoFactorEnabled" BOOLEAN DEFAULT false,
ALTER COLUMN "username" DROP NOT NULL;
