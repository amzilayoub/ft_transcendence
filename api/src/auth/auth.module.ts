import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [AuthService, PrismaModule],
  controllers: [AuthController],
})
export class AuthModule {}
