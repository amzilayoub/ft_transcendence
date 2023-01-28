import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './2fa.service';
import { TwoFactorAuthenticationController } from './2fa.controller';
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
                secret: configService.get('SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION_TIME'),
                },
            }),
        }),
    ],
    providers: [AuthService, TwoFactorAuthenticationService],
    controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
