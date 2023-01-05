import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: AuthService,
      ) {
        super({
        secretOrKey: process.env.SECRET_KEY,
          ignoreExpiration: false,
          jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
            return request?.cookies?.Authentication;
          }]),
        });
      }

    async validate(payload: any) {
        if (payload === null)
            return false;
        else {
            return payload;
        }
    }
}