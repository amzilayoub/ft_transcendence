import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}


  public getCookieWithJwtToken(_user: any) {
    const payload = {user :{ id : _user.id, email: _user.email, username: _user.username }};
    const token = this.jwt.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
  }



  async getByEmail(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User with this email does not exist');
    }
    await this.verifyPassword(dto.password, user.hash);
    delete user.hash;
    return user;
  }

  async verifyPassword(password: string, hash: string) {
    const isPasswordValid = await argon.verify(hash, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
  }

  async addNewUser(dto: AuthDto) {
    try
    {
      const hash = await argon.hash(dto.password);
        const user = await this.prisma.user.create({
          data: {
            username: dto.username,
            email: dto.email,
            hash,
            first_name: dto.first_name || null,
            last_name: dto.last_name || null,
          },
        });
        return user;
    } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already in use');
      }
      throw error;
    }
  }
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
