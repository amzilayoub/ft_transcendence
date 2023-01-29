import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class FortyTwoUserDto {
    @IsInt()
    id: number;
    @IsInt()
    intra_id: number;
    @IsString()
    email: string;
    @IsString()
    login: string;
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
