import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
    Res,
    UseGuards,
    Req,
    Get,
    Body,
    HttpCode,
    UnauthorizedException,
    HttpException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { TwoFactorAuthenticationCodeDto } from 'src/auth/dto';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';
import JwtGuard from 'src/common/guards/jwt1.guard';
import JwtTwoFactorGuard from 'src/common/guards/jwt_guard';
import { TwoFactorAuthenticationService } from './2fa.service';

/*
 ** Note:
 ** Enabling or disabling two-factor authentication won't take effect until the user logs out and logs in again.
 **
 */

@ApiTags('2FA')
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly authService: AuthService,
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
        private readonly configService: ConfigService,
    ) {}

    @Get('qr-code')
    @UseGuards(JwtTwoFactorGuard)
    async register(@Res() response: Response, @Req() request: RequestWithUser) {
        const otpauthUrl =
            await this.twoFactorAuthenticationService.generateTwoFactorAuthSecretKey(
                request.user,
            );

        return this.twoFactorAuthenticationService.pipeQrCodeStream(
            response,
            otpauthUrl,
        );
    }

    // Now, the user can generate a QR code, save it in the Google Authenticator application, and send a valid code to the /2fa/turn-on endpoint. If that’s the case, we acknowledge that the two-factor authentication has been saved.
    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtTwoFactorGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { code }: TwoFactorAuthenticationCodeDto,
    ) {
        try {
            const isCodeValid =
                await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                    request.user,
                    code,
                );
            if (!isCodeValid) {
                throw new UnauthorizedException('Wrong authentication code');
            }
            await this.authService.enableTwoFactor(request.user);
        } catch (e) {
            throw new HttpException(e.message, e.status);
        }
    }

    // @Post('turn-off')
    @Get('turn-off')
    @HttpCode(200)
    @UseGuards(JwtTwoFactorGuard)
    async turnOffTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        // @Body() { code }: TwoFactorAuthenticationCodeDto,
    ) {
        /*
         ** TODO: add code confirmation
         */
        // const isCodeValid =
        //     await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        //         request.user,
        //         code,
        //     );
        // if (!isCodeValid) {
        //     throw new UnauthorizedException('Wrong authentication code');
        // }
        await this.authService.disableTwoFactor(request.user);
    }

    // Logging in with two-factor authentication
    // the user logs in using the email and the password, and we respond with a JWT token,
    // if the 2FA is turned off, we give full access to the user,
    // if the 2FA is turned on, we provide the access just to the /2fa/authenticate endpoint,
    // the user looks up the Authenticator application code and sends it to the /2fa/authenticate endpoint; we respond with a new JWT token with full access.
    // @UseGuards(JwtTwoFactorGuard)
    @Post('verify')
    @UseGuards(JwtGuard)
    @HttpCode(200)
    async authenticate(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Body()
        { code }: TwoFactorAuthenticationCodeDto,
    ) {
        const isCodeValid =
            await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                request.user,
                code,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        const accessTokenCookie = this.authService.getCookieWithJwtToken(
            request.user,
            true,
        );
        response.setHeader('Set-Cookie', [accessTokenCookie]);
        response.sendStatus(200);
    }
}
