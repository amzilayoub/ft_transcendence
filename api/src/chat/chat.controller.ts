import { Controller, Post, Headers, Body, Get, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { user } from '@prisma/client';
import { ChatService } from './chat.service';
import { CreateRoomDto, JoinRoomDto } from './dto/chat_common.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private jwt: JwtService, private chatService: ChatService) {}

    /*
     ** if there's a userId in the coming request
     ** that means it's a DM, so we should first check if
     ** there's already a room between the 2 users
     ** if its the case, then we return it,
     ** otherwise, we create a new room
     */
    @Post('create-room')
    async createRoom(@Headers() headers, @Body() body: CreateRoomDto) {
        const user = this.getUserInfo(headers);
        const defaultRoom = await this.chatService.getRoomType('dm');
        const roomTypeId = body.roomTypeId || defaultRoom.id;

        if (body.userId) {
            const roomInfo = await this.chatService.findRoomBetweenUsers(
                user['id'],
                body.userId,
            );
            /*
             ** if we found a room, we return it
             */
            if (roomInfo[0] !== undefined)
                return await this.chatService.getRoomInfo(roomInfo[0].room_id);
        }

        const newRoom = await this.chatService.createRoom(user, roomTypeId);
        /*
         ** if there's a user in the request, that means we want to join
         ** the following user as well to the new created room
         */
        if (body.userId)
            await this.chatService.joinRoom(newRoom['id'], body.userId);

        /*
         ** by default, the owner of the room, obviously
         ** is going to be part of it :)
         */
        await this.chatService.joinRoom(newRoom['id'], user['id']);
        return newRoom;
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

    @Get('room/:roomId/members')
    async getRoomMembers(@Headers() headers, @Param('roomId') roomId: number) {
        const user = this.getUserInfo(headers);

        return await this.chatService.getRoomMembers(roomId);
    }

    @Get('room/:roomId/messages')
    async getRoomMessages(@Headers() headers, @Param('roomId') roomId: number) {
        const user = this.getUserInfo(headers);

        /*
         ** Set message as read for the user who requested them
         */
        await this.chatService.setMessagesAsRead(roomId, user['id']);
        /*
         ** then return the array of messages
         ** NOTE: Needs to add pagination here later on
         */
        return await this.chatService.getRoomMessages(roomId, user['id']);
    }

    getUserInfo(headers) {
        const token = headers.authorization.split(' ')[1];
        return this.jwt.decode(token);
    }
}
