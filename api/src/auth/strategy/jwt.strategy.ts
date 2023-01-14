import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
// import { FortyTwoUserDto } from '../dto';

// create a strategy and a guard that check if the two-factor authentication was successful.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            secretOrKey: process.env.SECRET_KEY,
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    if (request?.headers.authorization)
                        return request?.headers.authorization.split(' ')[1];
                    return request?.cookies?.Authentication;
                },
            ]),
        });
    }

    async validate(payload: any) {
        const user = await this.authService.getMe(payload.user.id);
        if (!user || payload === null) return false;
        else {
            return payload.user || payload;
        }
    }

    private static extractJWT(req: Request): string | null {
        if (!req.cookies) return null;
        return req.cookies['Authentication'] || null;
    }
}
