import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthenticationModule } from './twoFactorAuthentication/twoFactorAuthentication.module';
import { UserModule } from './users/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        TwoFactorAuthenticationModule,
        UserModule,
        ChatModule,
        PrismaModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
