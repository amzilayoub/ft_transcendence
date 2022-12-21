import { Controller, Post, Headers, Body, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { ChatService } from './chat.service';
import { CreateRoomDto, JoinRoomDto } from './dto/chat_common.dto';

@Controller('chat')
export class ChatController {
    constructor(private jwt: JwtService, private chatService: ChatService) {}

    @Post('create-room')
    async createRoom(@Headers() headers, @Body() body) {
        const user = this.getUserInfo(headers);
        const roomTypeId = body.roomTypeId || 1; // this number should be changed later on
        /*
         ** First we check if there's already a room between the 2 users
         ** then if no, we create it and return the id, otherwise,
         ** we return the id of the room
         */

        const res = await this.chatService.createRoom(user, roomTypeId);
        return res;
    }

    @Post('join-room')
    async JoinRoom(@Headers() headers, @Body() joinRoomDto: JoinRoomDto) {
        const user = this.getUserInfo(headers);
        const userId = joinRoomDto.userId || user['id'];

        return await this.chatService.joinRoom(joinRoomDto.roomId, userId);
    }

    @Get('rooms')
    async userRooms(@Headers() headers) {
        const user = this.getUserInfo(headers);
        return await this.chatService.getUserRooms(user['id']);
    }

    getUserInfo(headers) {
        const token = headers.authorization.split(' ')[1];
        return this.jwt.decode(token);
    }
}
