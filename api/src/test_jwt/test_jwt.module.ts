import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TestJwtController } from './test_jwt.controller';

@Module({
	imports: [JwtModule.register({})],
	controllers: [TestJwtController]
})
export class TestJwtModule { }
