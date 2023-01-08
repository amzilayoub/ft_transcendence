import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { LocalAuthenticationGuard } from './guards/auth.guard';
import RequestWithUser from './inrefaces/requestWithUser.interface';
import { Request, Response } from 'express';
import JwtGuard from 'src/common/guards/jwt_guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('signup')
  addNewUser(@Body() dto: AuthDto) {
    return this.authService.addNewUser(dto);
  }

  @UseGuards(JwtGuard)
  @Get('')
  test(@Req() req: Request) {
    const user = req.user;
    return user;
  };

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
  const {user} = request;
  const cookie = this.authService.getCookieWithJwtToken(user);
  response.setHeader('Set-Cookie', cookie);
  delete user.password;
  return response.send(user);
  }


  @UseGuards(JwtGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
  // @Get('/login/42')
  // async login42(@Req() request: RequestWithUser, @Res() response: Response) {
  //   // const url = await this.authService.login42();
  //   // return
  // }
}
