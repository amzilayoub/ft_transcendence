import { Injectable } from '@nestjs/common';
import { Message } from './dto/message.dto';

@Injectable()
export class ChatService {
  messages: Message[] = [
    {
      name: 'first_user',
      text: 'blablabla',
    },
  ];

  create(createMessage: Message) {
    this.messages.push(createMessage);

    return createMessage;
  }

  findAll() {
    return this.messages;
  }
}
