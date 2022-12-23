import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/chat_common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, room_type, user } from '@prisma/client';
import { use } from 'passport';
import { time } from 'console';

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) {}

    createMessage(room_id: number, user_id: number, message: string) {
        return this.prismaService.messages.create({
            data: {
                room_id,
                user_id,
                message,
            },
        });
    }

    createRoom(user, roomTypeId: number) {
        return this.prismaService.room.create({
            data: {
                owner_id: user.id,
                room_type_id: roomTypeId,
            },
        });
    }

    joinRoom(roomId: number, userId: number) {
        return this.prismaService.room_user_rel.create({
            data: {
                room_id: roomId,
                user_id: userId,
            },
        });
    }

    /*
     ** Get all rooms that the current user has been joined
     */
    getUserRooms(userId: number): Promise<Array<any>> {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT u2.*, room_type.type,
				CASE
					WHEN room_type.type = 'dm'
						THEN users.username
					ELSE
					--Here I should return the name of the room
						'shared room'
					END AS room_name
			FROM room_user_rel as u1, room_user_rel as u2, room, room_type, users
			-- here is inner join
			WHERE u1.room_id = room.id
			AND room.room_type_id = room_type.id
			AND users.id = u2.user_id
			-- Here is a self join
			AND u1.room_id = u2.room_id
			AND u1.user_id != u2.user_id
			AND u1.user_id = ${userId}
		`);
    }

    findRoomBetweenUsers(currentUserId: number, targetUserId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT u1.*
			FROM room_user_rel as u1, room_user_rel as u2
			WHERE u1.user_id = ${currentUserId}
			AND u2.user_id = ${targetUserId}
			AND u1.room_id = u2.room_id
		`);
    }

    getRoomInfo(roomId: number) {
        return this.prismaService.room.findFirst({
            where: {
                id: roomId,
            },
        });
    }

    getRoomType(name: string) {
        return this.prismaService.room_type.findFirst({
            where: {
                type: name,
            },
        });
    }

    findAllMessages() {
        return [];
    }
}
