import {
    IsIn,
    isIn,
    isInt,
    IsInt,
    isNumber,
    isNumberString,
    IsOptional,
    isString,
    IsString,
} from 'class-validator';

export class CreateRoomDto {
    @IsOptional()
    @IsInt()
    userId: number;

    @IsOptional()
    @IsInt()
    roomTypeId: number;

    @IsOptional()
    @IsString()
    title: string;
}

export class JoinRoomDto {
    @IsInt()
    roomId: number;

    @IsOptional()
    @IsInt()
    userId?: number;
}

export class CreateMessageDto {
    @IsInt()
    roomId: number;

    @IsString()
    token: string;

    @IsString()
    message: string;
}
