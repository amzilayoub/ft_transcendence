import { IsInt, isNumber, isNumberString, IsString } from 'class-validator';

export class CreateRoomDto {
    @IsInt()
    userId: number;

    @IsInt()
    roomId: number;
}
