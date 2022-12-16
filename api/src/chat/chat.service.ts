import { Injectable } from '@nestjs/common';
import { Message } from './dto/message.dto';
import { CreateRoomDto } from './dto/chat_common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, user } from '@prisma/client';
import { use } from 'passport';

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

    createRoom(createRoom: CreateRoomDto, user) {
        const test = this.prismaService.rooms.create({
            data: {
                userLink1: user.id,
                room_type: createRoom.roomId,
            },
        });
    }

    findAllMessages() {
        return this.messages;
    }
}
