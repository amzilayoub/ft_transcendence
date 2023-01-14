import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt-two-factor' }),
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
    ],
    providers: [AuthService, TwoFactorAuthenticationService],
    controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
