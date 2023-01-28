import { IsBoolean, IsString } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { FortyTwoUserDto } from 'src/auth/dto';

export class UserDto extends PartialType(FortyTwoUserDto) {
    id: number; // string might be a better Type. An edge case might fail, feeling.
    username: string;
    avatar_url: string;
    cover_url: string;
    isTwoFactorEnabled: boolean;
    @IsBoolean()
    twoFactorAuth: boolean;
    @IsString()
    twoFactorSecret: string;
    @IsString()
    TwoFactorSecret: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
