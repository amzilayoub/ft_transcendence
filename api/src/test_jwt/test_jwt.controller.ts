import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestJwtService } from './test_jwt.service';

@Controller('test-jwt')
export class TestJwtController {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private testJwtService: TestJwtService,
  ) {}

  @Post('auth')
  async auth(@Body() body) {
    const user = await this.testJwtService.insert(body.email, body.username);
    console.log(user);
    return await this.jwt.signAsync(body, {
      expiresIn: '5d',
      secret: this.configService.get<string>('SECRET_KEY'),
    });
  }
  
}
