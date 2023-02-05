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
    IsUrl,
    ValidateNested,
} from 'class-validator';
import { Url } from 'url';

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

export class RoomInfoDto {
    @IsString()
    name: string;

    @IsUrl()
    avatarUrl: string;

    @IsInt()
    roomId: number;

    @IsString()
    roomTypeName: string;
}

export class AddRoleDto {
    @IsString()
    role: string;

    @IsInt()
    userId: number;

    @IsInt()
    roomId: number;
}

export class UpdateRoomPassword {
    @IsInt()
    roomId: number;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;
}

export class KickoutDto {
    @IsInt()
    roomId: number;

    @IsInt()
    userId: number;
}

export class JoinRoomDto {
    @IsInt()
    roomId: number;

    @IsOptional()
    @IsInt()
    userId?: number;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    action?: string;
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

export class BanFromRoom {
    @IsInt()
    roomId: number;

    @IsInt()
    userId: number;

    @IsBoolean()
    banned: boolean;
}

export class BlockUserDto {
    @IsInt()
    blockedUserId: number;

    @IsInt()
    roomId: number;
}
