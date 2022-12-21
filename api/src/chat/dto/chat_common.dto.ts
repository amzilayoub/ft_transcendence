import {
    IsIn,
    isIn,
    isInt,
    IsInt,
    isNumber,
    isNumberString,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateRoomDto {
    @IsInt()
    userId: number;

    @IsInt()
    roomId: number;
}

export class JoinRoomDto {
    @IsInt()
    roomId: number;

    @IsOptional()
    @IsInt()
    userId?: number;
}
