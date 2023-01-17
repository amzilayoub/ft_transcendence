import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/common-notification.dto';

@Injectable()
export class NotificationService {
    constructor(private prismaService: PrismaService) {}

    create(createNotificationDto: CreateNotificationDto) {
        return 'This action adds a new notification';
    }
}
