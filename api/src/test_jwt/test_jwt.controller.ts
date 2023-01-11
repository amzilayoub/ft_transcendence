import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
        const user = await this.testJwtService.insert(
            body.email,
            body.username,
        );
        this.testJwtService.findAll();
        const token = await this.jwt.signAsync(user, {
            expiresIn: '5d',
            secret: this.configService.get<string>('SECRET_KEY'),
        });
        return { token };
    }

    @Get('user-token/:email')
    async getUserToken(@Param('email') email: string) {
        const user = await this.testJwtService.find(email);

        const token = await this.jwt.signAsync(user, {
            expiresIn: '5d',
            secret: this.configService.get<string>('SECRET_KEY'),
        });
        return { token };
    }

    @Get('users')
    async getAll() {
        return await this.testJwtService.findAll();
    }
}
