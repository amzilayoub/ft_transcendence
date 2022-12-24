import { JwtService } from '@nestjs/jwt';
import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { user } from '@prisma/client';
import { Socket } from 'dgram';
import { Server } from 'http';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/chat_common.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly jwt: JwtService,
    ) {}

    async handleConnection(@ConnectedSocket() client: any) {
        const user = this.getUserInfo(client.handshake.auth.token);
        if (user === null) return;
        const userRooms = await this.chatService.getUserRooms(user['id']);
        userRooms.forEach((element) => {
            client.join(element.room_id);
        });
    }

    @SubscribeMessage('createMessage')
    async createMessage(
        @MessageBody() createMessage: CreateMessageDto,
        @ConnectedSocket() client: any,
    ) {
        const user = this.getUserInfo(createMessage.token);
        const message = await this.chatService.createMessage(
            createMessage.roomId,
            user['id'],
            createMessage.message,
        );
        client.to(createMessage.roomId).emit('createMessage', message);
        return message;
    }

    @SubscribeMessage('findAllMessage')
    findAll() {
        return this.chatService.findAllMessages();
    }

    getUserInfo(token: string) {
        return this.jwt.decode(token);
    }
}
