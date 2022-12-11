import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { ChatService } from './chat.service';
import { Message } from './dto/message.dto';

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})

export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly chatService: ChatService) { }

	@SubscribeMessage('createMessage')
	async create(@MessageBody() createMessage: Message) {
		const message = await this.chatService.create(createMessage);
		this.server.emit('createMessage', message);

		return (message);
	}

	@SubscribeMessage('findAllMessage')
	findAll() {
		return this.chatService.findAll();
	}
}
