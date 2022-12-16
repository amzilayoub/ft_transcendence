import { Controller, Post, Headers, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/chat_common.dto';

@Controller('chat')
export class ChatController {
    constructor(private jwt: JwtService, private chatService: ChatService) {}

    @Post('create-room')
    createRoom(@Headers() headers, @Body() createRoomDto: CreateRoomDto) {
        const user = this.getUserInfo(headers);
        /*
         ** First we check if there's already a room between the 2 users
         ** then if no, we create it and return the id, otherwise,
         ** we return the id of the room
         */
        this.chatService.createRoom(createRoomDto, user);
    }

    getUserInfo(headers) {
        const token = headers.authorization.split(' ')[1];
        return this.jwt.decode(token);
    }
}
