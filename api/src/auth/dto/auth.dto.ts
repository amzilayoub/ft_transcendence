import {
    IsBoolean,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

// export class AuthDto {
//     @IsEmail()
//     @IsNotEmpty()
//     email: string;
//     @IsString()
//     @IsNotEmpty()
//     @MinLength(7)
//     password: string;
//     @IsString()
//     @IsOptional()
//     username?: string;
//     @IsString()
//     @IsOptional()
//     first_name?: string;
//     @IsString()
//     @IsOptional()
//     last_name?: string;
// }

// export class UserDto {
//     @IsInt()
//     id: number;
//     @IsString()
//     email: string;
//     @IsString()
//     username: string;
//     @IsString()
//     password: string;
//     @IsString()
//     first_name: string;
//     @IsString()
//     last_name: string;
// }

export class FortyTwoUserDto {
    @IsInt()
    id: number;
    @IsInt()
    intra_id: number;
    @IsString()
    email: string;
    @IsString()
    login: string;
    @IsBoolean()
    twoFactorAuth: boolean;
    @IsString()
    twoFactorSecret: string;
    @IsString()
    TwoFactorSecret: string;
    @IsString()
    first_name: string;
    @IsString()
    last_name: string;
    @IsString()
    intra_url: string;
    @IsString()
    phone: string;
    @IsString()
    displayname: string;
    image: {
        link: string;
        versions: {
            large: string;
            medium: string;
            small: string;
            micro: string;
        };
    };
}

export class TwoFactorAuthenticationCodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}
