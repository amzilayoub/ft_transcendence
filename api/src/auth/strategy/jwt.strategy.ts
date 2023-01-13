import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { FortyTwoUserDto } from '../dto';

// create a strategy and a guard that check if the two-factor authentication was successful.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            secretOrKey: process.env.SECRET_KEY,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
        });
    }

    async validate(payload: any) {
        // console.log('payload', payload);
        console.log('payload', payload.isSecondFactorAuthenticated);
        const user = await this.authService.getMe(payload.user.id);
        if (!user.isTwoFactorEnabled) {
            return user;
        }
        if (payload.isSecondFactorAuthenticated) {
            return user;
        }
    }
}
