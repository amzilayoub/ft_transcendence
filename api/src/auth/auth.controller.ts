import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './inrefaces/requestWithUser.interface';
import { Request, Response } from 'express';
import JwtGuard from 'src/common/guards/jwt_guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get('')
  test(@Req() req: Request) {
    const user = req.user;
    return user;
  };

  @UseGuards(AuthGuard('42'))
  @Get('login42')
  async fortyTwoAuth() {
    return 'Logged in with 42';
  }
  
    @HttpCode(200)
    @Get('redirect')
    async redirect(@Req() request: RequestWithUser, @Res() response: Response) {
      const { code } = request.query;
      const token = await this.authService.getAccessToken(code+"");
      if (!token) {
        return response.redirect('http://www.google.com/?q=mal+din+mok+m3e9ed');
      }
      const user = await this.authService.lesInformationsDeLutilisateur(token);
      const alreadyExist = await this.authService.checkIfUserExist(user.id);
      if (!alreadyExist) {
        const userData = await this.authService.add42User(user);
        const cookie = this.authService.getCookieWithJwtToken(userData);
        response.setHeader('Set-Cookie', cookie);
        response.redirect('/?q=HAD KHONA YALAH TZAD');
      }
      else
      {;
        if (alreadyExist.isTwoFactorEnabled) {
          const cookie = this.authService.getCookieWithJwtToken(alreadyExist);
          response.setHeader('Set-Cookie', cookie);
          response.redirect('/?q=2FA A OSTAD');
        }
        else {
          const cookie = this.authService.getCookieWithJwtToken(alreadyExist);
          response.setHeader('Set-Cookie', cookie);
          response.redirect('/?q=9SED MAKAYN WALO'); 
        }

      }
      response.send(JSON.stringify(alreadyExist));
    }


    @UseGuards(JwtGuard)
    @Post('logout42')
    async logOut(@Res() response: Response) {
      response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
      return response.sendStatus(200);
    }
    
  }
