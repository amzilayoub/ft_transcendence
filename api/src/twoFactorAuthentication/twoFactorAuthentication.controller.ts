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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { FortyTwoUserDto } from 'src/auth/dto';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';
import JwtGuard from 'src/common/guards/jwt_guard';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@ApiTags('2FA')
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly authService: AuthService,
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    ) {}

    @Post('generate')
    @UseGuards(JwtGuard)
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
    @UseGuards(JwtGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { twoFactorSecret }: FortyTwoUserDto,
    ) {
        const isCodeValid =
            this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                request.user,
                twoFactorSecret,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.authService.enableTwoFactor(request.user);
    }

    @Get('turn-off')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    async turnOffTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { twoFactorSecret }: FortyTwoUserDto,
    ) {
        const isCodeValid =
            this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
                request.user,
                twoFactorSecret,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.authService.disableTwoFactor(request.user);
    }
}
