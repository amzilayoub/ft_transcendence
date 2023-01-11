import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [AuthService, JwtService, TwoFactorAuthenticationService],
    controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
