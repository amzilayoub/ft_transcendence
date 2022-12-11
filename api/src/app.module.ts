import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [ChatModule, ConfigModule.forRoot({ isGlobal: true, }), PrismaModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
