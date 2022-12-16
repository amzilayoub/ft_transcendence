import {
<<<<<<< HEAD
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
=======
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
>>>>>>> d8352677ecf4e9d565f2ce4b67b49fcaeb5df490
} from '@nestjs/websockets';
import { Server } from 'http';
import { ChatService } from './chat.service';
import { Message } from './dto/message.dto';

@WebSocketGateway({
<<<<<<< HEAD
    cors: {
        origin: '*',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) {}

    @SubscribeMessage('createMessage')
    async create(@MessageBody() createMessage: Message) {
        const message = await this.chatService.createMessage(createMessage);
        this.server.emit('createMessage', message);

        return message;
    }

    @SubscribeMessage('findAllMessage')
    findAll() {
        return this.chatService.findAllMessages();
    }
=======
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessage: Message) {
    const message = await this.chatService.create(createMessage);
    this.server.emit('createMessage', message);

    return message;
  }

  @SubscribeMessage('findAllMessage')
  findAll() {
    return this.chatService.findAll();
  }
>>>>>>> d8352677ecf4e9d565f2ce4b67b49fcaeb5df490
}
