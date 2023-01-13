import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthenticationModule } from './twoFactorAuthentication/twoFactorAuthentication.module';

@Module({
    imports: [
        ChatModule,
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        TwoFactorAuthenticationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
