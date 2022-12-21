import { Injectable } from '@nestjs/common';
import { Message } from './dto/message.dto';
import { CreateRoomDto } from './dto/chat_common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, user } from '@prisma/client';
import { use } from 'passport';
import { time } from 'console';

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) {}

    messages: Message[] = [
        {
            name: 'first_user',
            text: 'blablabla',
        },
    ];

    createMessage(createMessage: Message) {
        this.messages.push(createMessage);

        return createMessage;
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

    getUserRooms(userId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT room_user_rel.*
			FROM (	SELECT *
					FROM room_user_rel
					WHERE user_id = ${userId}
			) as tbl
			INNER JOIN room_user_rel ON room_user_rel.room_id = tbl.room_id
			AND room_user_rel.user_id != ${userId}
		`);
    }

    findAllMessages() {
        return this.messages;
    }
}
