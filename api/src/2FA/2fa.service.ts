import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { AuthService } from 'src/auth/auth.service';
import { FortyTwoUserDto } from 'src/auth/dto/auth.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    // An essential thing above is that we save the generated secret in the database. We will need it later.
    async generateTwoFactorAuthSecretKey(user: UserDto) {
        const secret = authenticator.generateSecret();
        const url = authenticator.keyuri(
            user.username,
            this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME') ||
                'PFE',
            secret,
        );
        await this.authService.addSecret(user, secret);
        return url;
    }

    // We also need to serve the otpauth URL to the user in a QR code. To do that, we can use the qrcode library.
    public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
        return toFileStream(stream, otpauthUrl);
    }

    // Now we need to verify the token that the user sends us. We can use the verify method from the otplib library.
    public async isTwoFactorAuthenticationCodeValid(
        user: UserDto,
        token: string,
    ) {
        return authenticator.verify({ token, secret: user.TwoFactorSecret });
    }
}
