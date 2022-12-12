import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Controller('test-jwt')
export class TestJwtController {
	constructor(private jwt: JwtService, private configService: ConfigService) {
	}

	@Post("auth")
	async auth(@Body() body) {
		console.log(body.email)
		return (await this.jwt.signAsync(body, {
			expiresIn: '5d',
			secret: this.configService.get<string>('SECRET_KEY')
		}))
	}
}
