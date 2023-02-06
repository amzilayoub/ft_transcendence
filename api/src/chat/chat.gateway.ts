import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {
    BanFromRoom,
    BlockUserDto,
    CreateMessageDto,
    CreateRoomDto,
    JoinRoomDto,
    KickoutDto,
} from './dto/chat_common.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, room, room_type, user } from '@prisma/client';
import * as argon2 from 'argon2';
import { connected } from 'process';

const NAMESPACE = '/chat';
const configService = new ConfigService();
@WebSocketGateway({
    cors: {
        origin: configService.get('FRONTEND_URL'),
        credentials: true,
    },
    namespace: NAMESPACE,
})
export class ChatGateway {
    @WebSocketServer()
    private server;

    private connectedClient = {};
    private cookie;

    constructor(
        private readonly chatService: ChatService,
        private readonly authService: AuthService,
        private readonly jwt: JwtService,
    ) {
        this.cookie = require('cookie');
    }

    async handleConnection(@ConnectedSocket() client: any) {
        let user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        user = await this.authService.getMe(user['id']);
        if (!user) return;
        const userRooms = await this.chatService.getUserRooms(user['id']);
        if (user['id'] in this.connectedClient) {
            this.connectedClient[user['id']]['duplicatedSockets'].push(client);
        } else {
            this.connectedClient[user['id']] = {
                clientId: client.id,
                status: user.status == 'in-game' ? 'in-game' : 'online',
                duplicatedSockets: [],
                clientSocket: client,
            };
        }
        userRooms.forEach((element) => {
            client.join(NAMESPACE + element.room_id);
        });
        /*
         ** the following code is for the online status
         */
        this.server.emit('userConnect', {
            status: 200,
            data: {
                mode: user.status == 'in-game' ? 'in-game' : 'online',
                userId: user['id'],
            },
        });
        await this.chatService.updateUserStatus(
            user['id'],
            user.status == 'in-game' ? 'in-game' : 'online',
        );
    }

    async handleDisconnect(@ConnectedSocket() client: any) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        if (
            this.connectedClient[user['id']] &&
            !this.connectedClient[user['id']]['duplicatedSockets'].length
        ) {
            this.server.emit('userConnect', {
                status: 200,
                data: {
                    mode: 'offline',
                    userId: user['id'],
                },
            });
            delete this.connectedClient[user['id']];
        } else if (
            this.connectedClient[user['id']] &&
            this.connectedClient[user['id']]['duplicatedSockets']
        ) {
            this.connectedClient[user['id']]['duplicatedSockets'] =
                this.connectedClient[user['id']]['duplicatedSockets'].filter(
                    (item) => item.id != client.id,
                );
        }
        // await this.chatService.updateUserStatus(user['id'], 'offline');
    }

    @SubscribeMessage('userConnect')
    async userConnectStatus(
        @ConnectedSocket() client: any,
        @MessageBody('mode') mode: string,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        if (this.connectedClient[user['id']])
            this.connectedClient[user['id']].status = mode;
        this.server.emit('userConnect', {
            status: 200,
            data: {
                mode: mode,
                userId: user['id'],
            },
        });
        await this.chatService.updateUserStatus(user['id'], mode);
    }

    @SubscribeMessage('createRoom')
    async createRoom(
        @ConnectedSocket() client: any,
        @MessageBody() body: CreateRoomDto,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        const defaultRoom = await this.chatService.getRoomType('dm');
        const roomTypeId = body.roomTypeId || defaultRoom.id;

        if (body.userId && defaultRoom.type == 'dm') {
            const roomInfo = await this.chatService.findRoomBetweenUsers(
                user['id'],
                body.userId,
            );
            /*
             ** if we found a room, we return it
             */
            if (roomInfo[0] !== undefined)
                return {
                    status: 200,
                    data: await this.chatService.getRoomInfo(
                        roomInfo[0].room_id,
                    ),
                };
        }

        const newRoom = await this.chatService.createRoom(user, roomTypeId);
        /*
         ** Here we handle shared room
         */
        if (defaultRoom.id != roomTypeId) {
            const roomData = await this.chatService.getRoomTypeById(roomTypeId);
            if (!roomData) return { status: 401 };

            await this.handleSharedRoom(client, body, roomData, newRoom);
        }
        /*
         ** if there's a user in the request, that means we want to join
         ** the following user as well to the new created room
         */
        if (body.userId) {
            await this.chatService.joinRoom(newRoom['id'], body.userId);
        }

        /*
         ** by default, the owner of the room, obviously
         ** is going to be part of it :)
         */
        await this.chatService.joinRoom(newRoom['id'], user['id']);
        this.joinRoom(client, {
            roomId: newRoom.id,
            userId: body.userId,
            action: body.userId ? 'add' : 'update',
        });
        if (body.userId) {
            const socketId = this.connectedClient[body.userId].clientId;
            this.server.sockets.get(socketId)?.join(NAMESPACE + newRoom.id);
            this.connectedClient[body.userId]['duplicatedSockets'].forEach(
                (item) => {
                    item.join(NAMESPACE + newRoom.id);
                },
            );
        }
        if (defaultRoom.id != roomTypeId)
            this.notifyMembers(client, newRoom.id, user['id']); // if the list of conversation is not being updated, probably here
        return { status: 200, data: newRoom };
    }

    @SubscribeMessage('sendInvite')
    sendInvite(
        @ConnectedSocket() client: any,
        @MessageBody() body: CreateMessageDto,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        const clientId = this.connectedClient[body.roomId].clientSocket;
        clientId?.join(body.message);
        this.connectedClient[body.roomId]['duplicatedSockets'].forEach(
            (item) => {
                item.join(body.message);
            },
        );
        // clientId?.emit('sendInvite', {
        //     message: body.message
        // })

        this.server.to(body.message).emit('sendInvite', {
            username: user['username'],
            avatar_url: user['avatar_url'],
            message: body.message,
        });

        clientId?.leave(body.message);
        this.connectedClient[body.roomId]['duplicatedSockets'].forEach(
            (item) => {
                item.leave(body.message);
            },
        );
        // //console.log("@", clientId);
        // clientId.leave('/game')
        return { status: 200 };
    }
    /*
     ** if there's a userId in the coming request
     ** that means it's a DM, so we should first check if
     ** there's already a room between the 2 users
     ** if its the case, then we return it,
     ** otherwise, we create a new room
     */
    @SubscribeMessage('createMessage')
    async createMessage(
        @MessageBody() createMessage: CreateMessageDto,
        @ConnectedSocket() client: any,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        const targetedJoinedRecord = (
            await this.chatService.targetedJoinedRecord(
                createMessage.roomId,
                user['id'],
            )
        )[0];
        if (!targetedJoinedRecord)
            return {
                status: 401,
                message: 'you are not part of this channel',
            };
        /*
         ** check for muted
         */
        if (targetedJoinedRecord.muted) {
            return {
                status: 401,
                message:
                    "You're status is muted on this channel, you cannot send messages for now!",
            };
        }

        /*
         ** check for ban
         */
        if (targetedJoinedRecord.banned) {
            return {
                status: 401,
                message: 'You banned from this channel',
            };
        }
        /*
         ** check for blocked
         */

        const roomInfo = (
            await this.chatService.getDmRoomInfo(createMessage.roomId)
        )[0];
        if (roomInfo.type == 'dm') {
            const isThisUserBlocked = (
                await this.chatService.isThisUserBlocked(
                    user['id'],
                    createMessage.roomId,
                )
            )[0];
            if (isThisUserBlocked)
                return {
                    status: 401,
                    message: 'you cannot contact this user',
                };
        }

        /*
         ** handle create message
         */
        const message = await this.chatService.createMessage(
            createMessage.roomId,
            user['id'],
            createMessage.message,
        );
        await this.chatService.setRoomUnread(createMessage.roomId, user['id']);
        const msgObject = {
            id: message.id,
            senderId: message.user_id,
            message: message.message,
            time: message.created_at,
            roomId: message.room_id,
            isMe: false,
            avatar_url: user.avatar_url,
        };

        /*
         ** Get the users now
         */
        const listOfBlockedUsers = await this.getBlockedUsersByMe(user);
        const exceptRoomName = NAMESPACE + '/blacklist/' + user['id'];
        const exceptSockets = [];
        listOfBlockedUsers.forEach((item) => {
            const socketId = this.connectedClient[item.user_id].clientId;
            if (socketId) {
                const clientSocket = this.server.sockets.get(socketId);
                if (clientSocket) {
                    exceptSockets.push(clientSocket);
                    clientSocket.join(exceptRoomName);
                }
            }
            this.connectedClient[item.user_id]['duplicatedSockets'].forEach(
                (item) => {
                    exceptSockets.push(item);
                    item.join(exceptRoomName);
                },
            );
        });
        /*
         ** This one to update the chatbox
         */
        const connectedClientSockets = [];
        this.connectedClient[user['id']]['duplicatedSockets'].forEach(
            (item) => {
                connectedClientSockets.push(item.id);
            },
        );
        connectedClientSockets.push(this.connectedClient[user['id']].clientId);
        client
            .to(NAMESPACE + createMessage.roomId)
            .except(exceptRoomName)
            .emit('createMessage', {
                status: 200,
                data: msgObject,
                clients: connectedClientSockets,
            });

        /*
         ** and this one to update the list of conversations
         */

        await this.notifyMembers(
            client,
            message.room_id,
            user['id'],
            exceptRoomName,
        );
        exceptSockets.forEach((item) => {
            item.leave(exceptRoomName);
        });
        return { status: 200, data: msgObject };
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(
        @ConnectedSocket() client: any,
        @MessageBody() joinRoomDto: JoinRoomDto,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        client.join(NAMESPACE + joinRoomDto.roomId);
        this.connectedClient[user['id']]['duplicatedSockets'].forEach(
            (item) => {
                item.join(NAMESPACE + joinRoomDto.roomId);
            },
        );

        /*
         ** Get the other client if included, otherwise,
         ** its either a private/protected room
         */
        if (joinRoomDto.userId) {
            const socketId = this.connectedClient[joinRoomDto.userId]?.clientId;
            if (socketId) {
                this.server.sockets
                    .get(socketId)
                    ?.join(NAMESPACE + joinRoomDto.roomId);
                this.connectedClient[joinRoomDto.userId][
                    'duplicatedSockets'
                ].forEach((item) => {
                    item.join(NAMESPACE + joinRoomDto.roomId);
                });
            }
        }
        const room = (
            await this.chatService.getUserRooms(user['id'], joinRoomDto.roomId)
        )[0];
        if (room.user_id in this.connectedClient)
            room.userStatus = this.connectedClient[room.user_id].status;
        client.emit('updateListConversations', {
            status: 200,
            data: {
                room: room,
                clientId: client.id,
                userId: user['id'],
                action: joinRoomDto.action || 'add', // needs to check later on
            },
        });
        this.connectedClient[user['id']]['duplicatedSockets'].forEach(
            (item) => {
                item.emit('updateListConversations', {
                    status: 200,
                    data: {
                        room: room,
                        userId: user['id'],
                        clientId: client.id,
                        action: joinRoomDto.action || 'add', // needs to check later on
                    },
                });
            },
        );
        return { status: 200, data: true };
    }

    @SubscribeMessage('setAsUnead')
    setAsUnead(
        @ConnectedSocket() client: any,
        @MessageBody('roomId') roomId: number,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        return {
            status: 200,
            data: this.chatService.setRoomUnread(roomId, user['id']),
        };
    }

    @SubscribeMessage('setRead')
    async setRead(
        @ConnectedSocket() client: any,
        @MessageBody('roomId') roomId: number,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        return {
            status: 200,
            data: await this.chatService.setRoomAsRead(roomId, user['id']),
        };
    }
    @SubscribeMessage('user/block')
    async blockUser(
        @MessageBody() blockUserDto: BlockUserDto,
        @ConnectedSocket() client: any,
    ) {
        const user = this.getUserInfo(client);

        if (user === null) return { status: 401 };
        await this.chatService.blockUser(user.id, blockUserDto.blockedUserId);
        client.broadcast.to(NAMESPACE + blockUserDto.roomId).emit('block', {
            status: 200,
            data: {
                /*
                 ** true it means block, false it means unblock
                 */
                value: true,
                by: user['id'],
            },
        });
        return {
            status: 200,
            data: {
                value: true,
            },
        };
    }

    @SubscribeMessage('user/unblock')
    async unblockUser(
        @MessageBody() blockUserDto: BlockUserDto,
        @ConnectedSocket() client: any,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        await this.chatService.unblockUser(user.id, blockUserDto.blockedUserId);
        client.broadcast.to(NAMESPACE + blockUserDto.roomId).emit('block', {
            status: 200,
            data: {
                value: false,
                by: user['id'],
            },
        });
        return {
            status: 200,
            data: {
                value: false,
            },
        };
    }

    @SubscribeMessage('room/all')
    async getUserRooms(@ConnectedSocket() client: any) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        const rooms = await this.chatService.getUserRooms(user['id']);
        rooms.forEach((item) => {
            if (item.user_id in this.connectedClient)
                item.userStatus = this.connectedClient[item.user_id].status;
        });
        return rooms;
    }

    @SubscribeMessage('room/kickout')
    async roomKickout(
        @ConnectedSocket() client: any,
        @MessageBody() kickoutDto: KickoutDto,
    ) {
        /*
         ** first check if the user has the admin/ownership access rights
         ** check first if the user is the owner of the channel,
         ** if so, then move the ownership to the firt admin
         ** otherwise, remove the record
         */
        const user = this.getUserInfo(client);
        let returnVal = {
            status: 201,
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
                        status: 205,
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
                            status: 205,
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

            if (this.connectedClient[kickoutDto.userId]) {
                const socketId =
                    this.connectedClient[kickoutDto.userId].clientId;
                this.server.sockets
                    .get(socketId)
                    ?.leave(NAMESPACE + kickoutDto.roomId);
                this.connectedClient[kickoutDto.userId][
                    'duplicatedSockets'
                ].forEach((item) => {
                    item.leave(NAMESPACE + kickoutDto.roomId);
                });
            }
            await this.chatService.kickout(
                kickoutDto.userId,
                kickoutDto.roomId,
            );
        } else if (String(myRole.role).toLowerCase() == 'member') {
            if (this.connectedClient[kickoutDto.userId]) {
                const socketId =
                    this.connectedClient[kickoutDto.userId].clientId;
                this.server.sockets
                    .get(socketId)
                    ?.leave(NAMESPACE + kickoutDto.roomId);
                this.connectedClient[kickoutDto.userId][
                    'duplicatedSockets'
                ].forEach((item) => {
                    item.leave(NAMESPACE + kickoutDto.roomId);
                });
            }
            await this.chatService.kickout(
                kickoutDto.userId,
                kickoutDto.roomId,
            );
        } else {
            return { status: 401 };
        }
        return returnVal;
    }

    @SubscribeMessage('room/ban')
    async banUser(
        @ConnectedSocket() client: any,
        @MessageBody() banFromRoom: BanFromRoom,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        const myRole = (
            await this.chatService.getMyRole(user.id, banFromRoom.roomId)
        )[0];
        if (['admin', 'owner'].includes(myRole.role.toLowerCase()))
            await this.chatService.banUserFromRoom(
                banFromRoom.userId,
                banFromRoom.roomId,
                banFromRoom.banned,
            );
        else
            return {
                status: HttpStatus.FORBIDDEN,
            };
        if (this.connectedClient[banFromRoom.userId]) {
            if (banFromRoom.banned) {
                const socketId =
                    this.connectedClient[banFromRoom.userId].clientId;
                this.server.sockets
                    .get(socketId)
                    ?.leave(NAMESPACE + banFromRoom.roomId);
                this.connectedClient[banFromRoom.userId][
                    'duplicatedSockets'
                ].forEach((item) => {
                    item.leave(NAMESPACE + banFromRoom.roomId);
                });
            } else {
                const socketId =
                    this.connectedClient[banFromRoom.userId].clientId;
                this.server.sockets
                    .get(socketId)
                    ?.join(NAMESPACE + banFromRoom.roomId);
                this.connectedClient[banFromRoom.userId][
                    'duplicatedSockets'
                ].forEach((item) => {
                    item.join(NAMESPACE + banFromRoom.roomId);
                });
            }
        }
        return {
            status: HttpStatus.OK,
        };
    }

    /*
     ** Helper functions
     */

    async notifyMembers(
        client: any,
        roomId: number,
        userId: number,
        exceptRoom = '',
        action = 'add',
    ) {
        const room = (await this.chatService.getUserRooms(userId, roomId))[0];

        if (room?.user_id in this.connectedClient)
            room.userStatus = this.connectedClient[room.user_id].status;
        this.server
            .to(NAMESPACE + roomId)
            .except(exceptRoom)
            .emit('updateListConversations', {
                status: 200,
                data: {
                    room: room,
                    clientId: client.id,
                    userId: userId,
                    action,
                },
            });
    }

    async handleSharedRoom(
        @ConnectedSocket() client: any,
        @MessageBody() body: CreateRoomDto,
        roomTypeObject: room_type,
        newRoom: room,
    ) {
        const objectToInsert = {};
        const parsedRule = JSON.parse(roomTypeObject.rule);
        let jsonString = '';

        if (parsedRule['passwordRequired'] == true) {
            if (body.password === body.confirmPassword)
                objectToInsert['password'] = await argon2.hash(body.password);
        }
        await this.chatService.createRoomName(newRoom.id, body.name);
        jsonString = JSON.stringify(objectToInsert);
        if (jsonString != '{}')
            await this.chatService.createRoomRule(newRoom.id, jsonString);
    }

    getUserInfo(client) {
        const token = this.getTokenFromCookie(client);
        if (!token) return null;

        const data = this.jwt.decode(token);
        return data['user'];
    }

    getTokenFromCookie(@ConnectedSocket() client: any) {
        if (!client.handshake.headers.cookie) return null;
        // //console.log("@@@@@@@@@@@@", client.handshake.headers.cookie)
        const authToken = this.cookie.parse(client.handshake.headers.cookie)[
            'Authentication'
        ];
        if (authToken) return authToken;
        return null;
    }

    async isJoined(userId: number, roomId: number) {
        const res = await this.chatService.isJoined(userId, roomId);
        return res.length > 0;
    }

    async getBlockedUsersByMe(user: user): Promise<any> {
        return await this.chatService.getBlockedUsersByMe(user['id']);
    }
}
