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
import JwtGuard from 'src/common/guards/jwt_guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtGuard)
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
            return response.redirect(
                'http://www.google.com/?q=mal+din+mok+m3e9ed',
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
            response.redirect('/?q=HAD KHONA YALAH TZAD');
            return;
        } else {
            if (alreadyExist.isTwoFactorEnabled) {
                const cookie = this.authService.getCookieWithJwtToken(
                    alreadyExist,
                    // true,
                );
                response.setHeader('Set-Cookie', cookie);
                response.redirect('/api/2fa/generate');
                return;
            } else {
                const cookie =
                    this.authService.getCookieWithJwtToken(alreadyExist);
                response.setHeader('Set-Cookie', cookie);
                response.redirect('/?q=9SED MAKAYN WALO');
                return;
            }
        }
    }

    @UseGuards(JwtGuard)
    @Get('logout42')
    async logOut(@Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtGuard)
    @Post('2fa_on')
    async twoFactorOn(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        await this.authService.enableTwoFactor(request.user);
        response.send('2FA ON');
    }

    // @UseGuards(JwtGuard)
    // @Post('change_avatar')
    // async changeAvatar(
    //     @Req() request: RequestWithUser,
    //     @Res() response: Response,
    // ) {
    //     await this.authService.changeAvatar(request.user);
    //     response.send('AVATAR ');
    // }
}
