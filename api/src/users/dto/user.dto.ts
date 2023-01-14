import { PartialType } from '@nestjs/swagger';
import { FortyTwoUserDto } from 'src/auth/dto';

export class UserDto extends PartialType(FortyTwoUserDto) {
    username: string;
    avatar_url: string;
    cover_url: string;
    isTwoFactorEnabled: boolean;
}

export class UpdateUserDto extends PartialType(UserDto) {}
