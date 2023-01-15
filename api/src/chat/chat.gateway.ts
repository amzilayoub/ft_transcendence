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
        if (user === null) return;
        const userRooms = await this.chatService.getUserRooms(user['id']);
        this.connectedClient[user['id']] = client.id;
        userRooms.forEach((element) => {
            client.join(NAMESPACE + element.room_id);
        });
    }

    handleDisconnect(@ConnectedSocket() client: any) {
        const user = this.getUserInfo(client);
        if (user === null) return;

        delete this.connectedClient[user['id']];
    }

    @SubscribeMessage('createRoom')
    async createRoom(
        @ConnectedSocket() client: any,
        @MessageBody() body: CreateRoomDto,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return;

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
        if (body.userId) {
            await this.chatService.joinRoom(newRoom['id'], body.userId);
            this.joinRoom(client, { roomId: newRoom.id, userId: body.userId });
        }

        /*
         ** by default, the owner of the room, obviously
         ** is going to be part of it :)
         */
        await this.chatService.joinRoom(newRoom['id'], user['id']);
        this.joinRoom(client, { roomId: newRoom.id, userId: user['id'] });
        this.notifyMembers(client, newRoom.id, user['id']);
        return newRoom;
    }

    @SubscribeMessage('createMessage')
    async createMessage(
        @MessageBody() createMessage: CreateMessageDto,
        @ConnectedSocket() client: any,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return;
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
        };
        // client.to(createMessage.roomId).emit('createMessage', msgObject);
        /*
         ** This one to update the chatbox
         */
        client
            .to(NAMESPACE + createMessage.roomId)
            .emit('createMessage', msgObject);

        /*
         ** and this one to update the list of conversations
         */
        this.notifyMembers(client, message.room_id, user['id']);
        return msgObject;
    }

    @SubscribeMessage('joinRoom')
    joinRoom(
        @ConnectedSocket() client: any,
        @MessageBody() joinRoomDto: JoinRoomDto,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return;
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
        return true;
    }

    @SubscribeMessage('setAsUnead')
    setAsUnead(
        @ConnectedSocket() client: any,
        @MessageBody('roomId') roomId: number,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return;
        return this.chatService.setRoomUnread(roomId, user['id']);
    }

    @SubscribeMessage('setRead')
    setRead(
        @ConnectedSocket() client: any,
        @MessageBody('roomId') roomId: number,
    ) {
        const user = this.getUserInfo(client);
        if (user === null) return;

        return this.chatService.setRoomAsRead(roomId, user['id']);
    }

    @SubscribeMessage('findAllMessage')
    findAll() {
        return this.chatService.findAllMessages();
    }

    /*
     ** Helper functions
     */

    async notifyMembers(client: any, roomId: number, userId: number) {
        this.server.to(NAMESPACE + roomId).emit('updateListConversations', {
            room: (await this.chatService.getUserRooms(userId, roomId))[0],
            clientId: client.id,
        });
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
}
