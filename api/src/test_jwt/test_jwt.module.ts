/*
 * this moduke should be removed
 * its been used for now just for testing purposes
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TestJwtController } from './test_jwt.controller';
import { TestJwtService } from './test_jwt.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TestJwtController],
  providers: [TestJwtService],
})
export class TestJwtModule {}