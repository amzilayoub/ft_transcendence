import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/common-notification.dto';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

const NAMESPACE = '/notification';
const configService = new ConfigService();
@WebSocketGateway({
    cors: {
        origin: configService.get('FRONTEND_URL'),
        credentials: true,
    },
    namespace: NAMESPACE,
})
export class NotificationGateway {
    @WebSocketServer()
    private server;

    constructor(
        private readonly notificationService: NotificationService,
        private readonly authService: AuthService,
    ) {}

    @SubscribeMessage('createNotification')
    async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
        return { status: 200, data: 'hello' };
    }
}
