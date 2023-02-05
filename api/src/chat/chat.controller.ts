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
    BanFromRoom,
    BlockUserDto,
    CreateRoomDto,
    JoinRoomDto,
    KickoutDto,
    MuteUserDto,
    UpdateRoomPassword,
    RoomInfoDto,
    AddRoleDto,
} from './dto/chat_common.dto';
import JwtGuard from 'src/common/guards/jwt_guard';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { room_user_rel } from '@prisma/client';

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
            await this.chatService.isJoined(userId, joinRoomDto.roomId)
        )[0]; // if an error happened later on f join room, it's probably here, change it to user.id
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
        @Req() request: RequestWithUser,
        @Param('roomId') roomId: number,
        @Param('username') username = '',
    ) {
        const user = await this.authService.getMe(request.user.id);
        const myRole = (await this.chatService.getMyRole(user.id, roomId))[0];
        const members = await this.chatService.getRoomMembers(
            roomId,
            user.id,
            username,
        );
        return {
            myRole: myRole?.role,
            members,
        };
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

    /*
     ** this is for shared room and not for DMs
     */
    @Post('room/ban')
    async blockUserFromRoom(
        @Req() request: RequestWithUser,
        @Body() banFromRoom: BanFromRoom,
    ) {
        const user = await this.authService.getMe(request.user.id);

        const myRole = (
            await this.chatService.getMyRole(user.id, banFromRoom.roomId)
        )[0];
        if (['admin', 'owner'].includes(myRole.role.toLowerCase()))
            await this.chatService.banUserFromRoom(
                banFromRoom.userId,
                banFromRoom.roomId,
                banFromRoom.banned,
            );
        else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        return {
            status: HttpStatus.OK,
        };
    }

    @Post('room/kickout')
    async kickout(
        @Req() request: RequestWithUser,
        @Body() kickoutDto: KickoutDto,
    ) {
        /*
         ** first check if the user has the admin/ownership access rights
         ** check first if the user is the owner of the channel,
         ** if so, then move the ownership to the firt admin
         ** otherwise, remove the record
         */
        const user = await this.authService.getMe(request.user.id);
        let returnVal = {
            status: HttpStatus.OK,
            userId: -1,
        };

        const myRole = (
            await this.chatService.getMyRole(user.id, kickoutDto.roomId)
        )[0];
        if (['admin', 'owner'].includes(myRole.role.toLowerCase())) {
            const getRoomInfo = (
                await this.chatService.getRoomInfo(kickoutDto.roomId)
            )[0];
            if (getRoomInfo?.owner_id == kickoutDto.userId) {
                const roomAdmins = await this.chatService.getRoomUsersByRole(
                    kickoutDto.roomId,
                    getRoomInfo?.owner_id,
                    'Admin',
                );
                if (roomAdmins.length) {
                    await this.chatService.setRoomOwnerShip(
                        kickoutDto.roomId,
                        roomAdmins[0].user_id,
                    );
                    returnVal = {
                        status: HttpStatus.CONTINUE,
                        userId: roomAdmins[0].user_id,
                    };
                } else {
                    const roomMembers =
                        await this.chatService.getRoomUsersByRole(
                            kickoutDto.roomId,
                            getRoomInfo?.owner_id,
                            'Member',
                        );
                    if (roomMembers.length) {
                        await this.chatService.setRoomOwnerShip(
                            kickoutDto.roomId,
                            roomMembers[0].user_id,
                        );
                        returnVal = {
                            status: HttpStatus.CONTINUE,
                            userId: roomMembers[0].user_id,
                        };
                    } else {
                        await this.chatService.deleteRoom(kickoutDto.roomId);
                        return {
                            status: HttpStatus.NO_CONTENT,
                            type: 'delete',
                        };
                    }
                }
            }

            await this.chatService.kickout(
                kickoutDto.userId,
                kickoutDto.roomId,
            );
        } else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        return returnVal;
    }

    @Post('room/update-info')
    async updateRoomInfo(@Body() roomInfoDto) {
        await this.chatService.updateRoomInfo(
            roomInfoDto.name,
            roomInfoDto.avatarUrl,
            roomInfoDto.roomId,
        );

        const roomType = await this.chatService.getRoomType(
            roomInfoDto.roomTypeName,
        );
        await this.chatService.updateRoomType(roomInfoDto.roomId, roomType.id);
        return { status: 'done' };
    }

    @Post('room/change-password')
    async roomChangePassword(
        @Req() request: RequestWithUser,
        @Body() updateRoomPassword: UpdateRoomPassword,
    ) {
        const user = await this.authService.getMe(request.user.id);

        const isRoomOwner = await this.chatService.isRoomOwner(
            updateRoomPassword.roomId,
            user.id,
        );
        if (!isRoomOwner)
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        const roomInfo = (
            await this.chatService.getRoomInfo(updateRoomPassword.roomId)
        )[0];
        if (updateRoomPassword.password !== updateRoomPassword.confirmPassword)
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        let roomRule = JSON.parse(roomInfo['rule']);
        roomRule = {
            ...roomRule,
            password: await argon2.hash(updateRoomPassword.password),
        };
        const roomType = await this.chatService.getRoomType('protected');
        await this.chatService.updateRoomType(
            updateRoomPassword.roomId,
            roomType.id,
        );
        await this.chatService.updateRoomRules(
            updateRoomPassword.roomId,
            JSON.stringify(roomRule),
        );
        return true;
    }

    @Post('/room/members/add-role')
    async setRole(
        @Req() request: RequestWithUser,
        @Body() addRoleDto: AddRoleDto,
    ) {
        const user = await this.authService.getMe(request.user.id);
        const myRole = (
            await this.chatService.getMyRole(user.id, addRoleDto.roomId)
        )[0];

        if (['Admin', 'Owner'].includes(myRole.role)) {
            await this.chatService.updateUserRole(
                addRoleDto.userId,
                addRoleDto.roomId,
                addRoleDto.role,
            );
            return { status: 200 };
        }
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
}
