import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TestJwtModule } from './test_jwt/test_jwt.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ChatModule, ConfigModule.forRoot({ isGlobal: true, }), PrismaModule, TestJwtModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
