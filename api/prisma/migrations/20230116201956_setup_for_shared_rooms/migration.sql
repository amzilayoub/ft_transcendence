-- AlterTable
ALTER TABLE "room_type" ADD COLUMN     "rule" TEXT;

-- CreateTable
CREATE TABLE "room_name" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_admin" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_password" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_password_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_name" ADD CONSTRAINT "room_name_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_admin" ADD CONSTRAINT "room_admin_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_admin" ADD CONSTRAINT "room_admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_password" ADD CONSTRAINT "room_password_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
