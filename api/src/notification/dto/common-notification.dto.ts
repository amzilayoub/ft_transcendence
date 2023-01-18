import { IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
    @IsNumber()
    toUserId: number;

    @IsNumber()
    @IsOptional()
    eventId: number;
}
