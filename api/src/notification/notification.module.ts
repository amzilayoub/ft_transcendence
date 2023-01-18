import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [AuthModule, JwtModule],
    providers: [NotificationGateway, NotificationService, AuthService],
})
export class NotificationModule {}
