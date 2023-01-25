import {
    IsArray,
    IsBoolean,
    IsIn,
    isIn,
    isInt,
    IsInt,
    IsNumber,
    isNumber,
    isNumberString,
    IsOptional,
    isString,
    IsString,
    ValidateNested,
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
    name: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    confirmPassword: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @IsInt()
    usersId: number[];
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
    message: string;
}
export class MuteUserDto {
    @IsInt()
    roomId: number;

    @IsInt()
    userId: number;

    @IsBoolean()
    muted: boolean;
}

export class BlockUserDto {
    @IsInt()
    blockedUserId: number;

    @IsInt()
    userId: number;
}
