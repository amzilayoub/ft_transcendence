import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {
    CreateMessageDto,
    CreateRoomDto,
    JoinRoomDto,
} from './dto/chat_common.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, room, room_type, user } from '@prisma/client';
import * as argon2 from 'argon2';

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
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };
        const userRooms = await this.chatService.getUserRooms(user['id']);
        this.connectedClient[user['id']] = client.id;
        userRooms.forEach((element) => {
            client.join(NAMESPACE + element.room_id);
        });
    }

    handleDisconnect(@ConnectedSocket() client: any) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        delete this.connectedClient[user['id']];
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
            // this.joinRoom(client, { roomId: newRoom.id, userId: body.userId });
        }

        /*
         ** by default, the owner of the room, obviously
         ** is going to be part of it :)
         */
        await this.chatService.joinRoom(newRoom['id'], user['id']);
        this.joinRoom(client, { roomId: newRoom.id, userId: user['id'] });
        this.notifyMembers(client, newRoom.id, user['id']);
        return { status: 200, data: newRoom };
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
        const exceptRoom = NAMESPACE + '/blacklist/' + user['id'];
        listOfBlockedUsers.forEach((item) => {
            const socketId = this.connectedClient[item.user_id];
            if (socketId) {
                const clientSocket = this.server.sockets.get(socketId);
                if (clientSocket) clientSocket.join(exceptRoom);
            }
        });
        /*
         ** This one to update the chatbox
         */
        client
            .to(NAMESPACE + createMessage.roomId)
            .except(exceptRoom)
            .emit('createMessage', msgObject);

        /*
         ** and this one to update the list of conversations
         */

        await this.notifyMembers(
            client,
            message.room_id,
            user['id'],
            exceptRoom,
        );
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
        /*
         ** Get the other client if included, otherwise,
         ** its either a private/protected room
         */
        if (joinRoomDto.userId) {
            const socketId = this.connectedClient[joinRoomDto.userId];
            this.server.sockets
                .get(socketId)
                ?.join(NAMESPACE + joinRoomDto.roomId);
        }
        const room = await this.chatService.getUserRooms(
            user['id'],
            joinRoomDto.roomId,
        );
        client.emit('updateListConversations', {
            status: 200,
            data: {
                room: room[0],
                clientId: client.id,
            },
        });
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
    setRead(
        @ConnectedSocket() client: any,
        @MessageBody('roomId') roomId: number,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return { status: 401 };

        return {
            status: 200,
            data: this.chatService.setRoomAsRead(roomId, user['id']),
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
    ) {
        const room = await this.chatService.getUserRooms(userId, roomId);
        this.server
            .to(NAMESPACE + roomId)
            .except(exceptRoom)
            .emit('updateListConversations', {
                status: 200,
                data: {
                    room: room[0],
                    clientId: client.id,
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
            await this.chatService.createRoomRule(
                roomTypeObject.id,
                jsonString,
            );
    }

    getUserInfo(client) {
        const token = this.getTokenFromCookie(client);
        if (!token) return null;

        const data = this.jwt.decode(token);
        return data['user'];
    }

    getTokenFromCookie(@ConnectedSocket() client: any) {
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
