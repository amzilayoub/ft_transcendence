import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    Req,
    Headers,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateRoomDto, JoinRoomDto } from './dto/chat_common.dto';
import JwtGuard from 'src/common/guards/jwt_guard';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';
import { JwtService } from '@nestjs/jwt';

@UseGuards(JwtGuard)
/*
 ** NOTE: Checks to do later on:
 ** 1- check if the user has the right to get the room info (members, messages....), like if he joined the room already
 */
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(
        private authService: AuthService,
        private chatService: ChatService,
        private jwt: JwtService,
    ) {}

    /*
     ** if there's a userId in the coming request
     ** that means it's a DM, so we should first check if
     ** there's already a room between the 2 users
     ** if its the case, then we return it,
     ** otherwise, we create a new room
     */
    @Post('room/create')
    async createRoom(
        @Req() request: RequestWithUser,
        @Body() body: CreateRoomDto,
    ) {
        // const user = await this.authService.getMe(request.user.id);

        // const defaultRoom = await this.chatService.getRoomType('dm');
        // const roomTypeId = body.roomTypeId || defaultRoom.id;

        // if (body.userId) {
        //     const roomInfo = await this.chatService.findRoomBetweenUsers(
        //         user['id'],
        //         body.userId,
        //     );
        //     /*
        //      ** if we found a room, we return it
        //      */
        //     if (roomInfo[0] !== undefined)
        //         return await this.chatService.getRoomInfo(roomInfo[0].room_id);
        // }

        // const newRoom = await this.chatService.createRoom(user, roomTypeId);
        // /*
        //  ** if there's a user in the request, that means we want to join
        //  ** the following user as well to the new created room
        //  */
        // if (body.userId)
        //     await this.chatService.joinRoom(newRoom['id'], body.userId);

        // /*
        //  ** by default, the owner of the room, obviously
        //  ** is going to be part of it :)
        //  */
        // await this.chatService.joinRoom(newRoom['id'], user['id']);
        // return newRoom;
    }

    @Post('join-room')
    async JoinRoom(
        @Req() request: RequestWithUser,
        @Body() joinRoomDto: JoinRoomDto,
    ) {
        const user = await this.authService.getMe(request.user.id);
        const userId = joinRoomDto.userId || user['id'];

        return await this.chatService.joinRoom(joinRoomDto.roomId, userId);
    }

    @Get('room/all')
    async userRooms(@Req() request: RequestWithUser) {
        const user = await this.authService.getMe(request.user.id);
        return await this.chatService.getUserRooms(user['id']);
    }

    @Get('room/search/:roomName')
    async searchRoom(
        @Req() request: RequestWithUser,
        @Param('roomName') roomName: string,
    ) {
        const user = await this.authService.getMe(request.user.id);

        return this.chatService.getUserRooms(user['id'], -1, roomName);
    }

    @Get('room/:roomId/members')
    async getRoomMembers(
        @Req() request: RequestWithUser,
        @Param('roomId') roomId: number,
    ) {
        const user = await this.authService.getMe(request.user.id);

        return await this.chatService.getRoomMembers(roomId);
    }

    @Get('room/:roomId/messages')
    async getRoomMessages(
        @Req() request: RequestWithUser,
        @Param('roomId') roomId: number,
    ) {
        const user = await this.authService.getMe(request.user.id);

        /*
         ** Set message as read for the user who requested them
         */
        await this.chatService.setRoomAsRead(roomId, user['id']);
        /*
         ** then return the array of messages
         ** NOTE: Needs to add pagination here later on
         */
        return await this.chatService.getRoomMessages(roomId, user['id']);
    }

    @Get('room/:roomId')
    async getRoomById(
        @Req() request: RequestWithUser,
        @Param('roomId') roomId: number,
    ) {
        const user = await this.authService.getMe(request.user.id);

        return await this.chatService.getUserRooms(user['id'], roomId);
    }
}
