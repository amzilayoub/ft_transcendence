import {
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './inrefaces/requestWithUser.interface';
import { Response } from 'express';
import JwtTwoFactorGuard from 'src/common/guards/jwt_guard';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @UseGuards(JwtTwoFactorGuard)
    @Get('')
    async test(@Req() req: RequestWithUser, @Res() res: Response) {
        const test = await this.authService.getMe(req.user.id);
        res.send(test);
    }

    @UseGuards(AuthGuard('42'))
    @Get('login42')
    async fortyTwoAuth() {
        return 'Logged in with 42';
    }

    @HttpCode(200)
    @Get('redirect')
    async redirect(@Req() request: RequestWithUser, @Res() response: Response) {
        const { code } = request.query;
        const token = await this.authService.getAccessToken(code + '');
        if (!token) {
            response.redirect(
                this.configService.get('FRONTEND_URL') + '/?error=user-denied',
            );
        }
        const user = await this.authService.lesInformationsDeLutilisateur(
            token,
        );
        const alreadyExist = await this.authService.checkIfUserExist(user.id);
        if (!alreadyExist) {
            const userData = await this.authService.add42User(user);
            const cookie = this.authService.getCookieWithJwtToken(userData);
            response.setHeader('Set-Cookie', cookie);
            response.redirect(
                this.configService.get('FRONTEND_URL') + '/home?new-user=true',
            );
        } else {
            if (alreadyExist.isTwoFactorEnabled) {
                const cookie = this.authService.getCookieWithJwtToken(
                    alreadyExist,
                    false,
                );
                response.setHeader('Set-Cookie', cookie);
                response.setHeader('2fa', 'true');
                response.redirect(
                    this.configService.get('FRONTEND_URL') + '/?2fa=true',
                );
            } else {
                const cookie =
                    this.authService.getCookieWithJwtToken(alreadyExist);
                response.setHeader('Set-Cookie', cookie);
                response.redirect(
                    this.configService.get('FRONTEND_URL') + '/home',
                );
            }
        }
    }

    @UseGuards(JwtTwoFactorGuard)
    @Get('logout')
    async logout(@Req() request: RequestWithUser, @Res() response: Response) {
        console.log('LOGOUT');
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        response.send(200);
    }

    @UseGuards(JwtTwoFactorGuard)
    @Post('2fa_on')
    async twoFactorOn(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        await this.authService.enableTwoFactor(request.user);
        response.send('2FA ON');
    }

    // temporary endpoint, should be in 'user' resource.
    @UseGuards(JwtTwoFactorGuard)
    @Get('me')
    async getMe(@Req() request: RequestWithUser, @Res() response: Response) {
        const user = await this.authService.getMe(request.user.id);
        // console.log("INSIDE", user);
        response.send(user);
    }
}
