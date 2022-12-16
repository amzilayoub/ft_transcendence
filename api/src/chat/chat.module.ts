import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
})
export class ChatModule {}
