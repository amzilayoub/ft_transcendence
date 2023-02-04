import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TwoFactorAuthenticationModule } from './2FA/2fa.module';
import { UserModule } from './users/user.module';
import { TestJwtModule } from './test_jwt/test_jwt.module';
import { NotificationModule } from './notification/notification.module';
import { GameModule } from './game/game.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        TwoFactorAuthenticationModule,
        UserModule,
        GameModule,
        ChatModule,
        PrismaModule,
        TestJwtModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
