import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
<<<<<<< HEAD
    imports: [JwtModule],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
=======
  providers: [ChatGateway, ChatService],
>>>>>>> d8352677ecf4e9d565f2ce4b67b49fcaeb5df490
})
export class ChatModule {}
