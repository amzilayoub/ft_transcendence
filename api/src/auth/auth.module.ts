import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtTwoFactorStrategy } from './strategy/jwt2.strategy';
import { FortyTwoStrategy } from './strategy/ft.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: process.env.SECRET_KEY,
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRATION_TIME,
                },
            }),
        }),
        PassportModule.register({
            strategy: FortyTwoStrategy,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        }),
    ],
    providers: [
        AuthService,
        JwtTwoFactorStrategy,
        JwtStrategy,
        FortyTwoStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
