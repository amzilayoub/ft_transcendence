import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    Req,
    Headers,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import {
    BlockUserDto,
    CreateRoomDto,
    JoinRoomDto,
    MuteUserDto,
} from './dto/chat_common.dto';
import JwtGuard from 'src/common/guards/jwt_guard';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

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

    @Post('room/join')
    async JoinRoom(
        @Req() request: RequestWithUser,
        @Body() joinRoomDto: JoinRoomDto,
    ) {
        const user = await this.authService.getMe(request.user.id);
        const userId = joinRoomDto.userId || user['id'];
        const isJoined = (
            await this.chatService.isJoined(user.id, joinRoomDto.roomId)
        )[0];
        let shouldJoin = false;
        if (!isJoined) {
            const roomData = (
                await this.chatService.getRoomInfo(joinRoomDto.roomId)
            )[0];
            if (String(roomData.type).toLowerCase() == 'protected') {
                shouldJoin = false;
                const passwordCorrect = await argon2.verify(
                    JSON.parse(roomData.rule).password,
                    joinRoomDto.password,
                );
                if (passwordCorrect) {
                    shouldJoin = true;
                }
            } else shouldJoin = true;
        }
        if (shouldJoin)
            return await this.chatService.joinRoom(joinRoomDto.roomId, userId);
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    @Get('/room/types/all')
    async getAllRoomType(@Req() request: RequestWithUser) {
        return await this.chatService.getAllRoomType();
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

    @Get('room/explore/:roomName?')
    async exploreRooms(
        @Req() request: RequestWithUser,
        @Param('roomName') roomName = '',
    ) {
        const user = await this.authService.getMe(request.user.id);
        return await this.chatService.exploreRooms(roomName, user['id']);
    }

    @Get('room/:roomId/members/:username?')
    async getRoomMembers(
        @Param('roomId') roomId: number,
        @Param('username') username = '',
    ) {
        return await this.chatService.getRoomMembers(roomId, username);
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

        if (isNaN(roomId)) return [];
        return await this.chatService.getUserRooms(user['id'], roomId);
    }

    @Get('room/info/:roomId')
    async getRoomInfo(@Param('roomId') roomId: number) {
        return await this.chatService.getRoomInfo(roomId);
    }

    @Post('room/mute')
    async muteUser(@Body() muteUserDto: MuteUserDto) {
        await this.chatService.muteUser(
            muteUserDto.userId,
            muteUserDto.roomId,
            muteUserDto.muted,
        );
    }
}
