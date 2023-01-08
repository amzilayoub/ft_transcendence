import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  first_name?: string;
  @IsString()
  @IsOptional()
  last_name?: string;
}

export class UserDto {
  @IsInt()
  id: number;
  @IsString()
  email: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
}

export class User42Dto {
  @IsInt()
  id: number;
  @IsString()
  email: string;
  @IsString()
  username: string;
  @IsString()
  avatar: string;
}
