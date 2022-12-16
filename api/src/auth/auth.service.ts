import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async signup(dto: AuthDto) {
    // console.log({ dto });
    //generate password hash
    const hash = await argon.hash(dto.password);
    //create user
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
          created_at: new Date(),
          updated_at: new Date(),
          first_name: null,
          last_name: null,
        },
      });
      // delete user.hash;
      // return user;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
        throw error;
      }
    }
    // return user;
  }

  async signin(dto: AuthDto) {
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user not found throw error
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    //compare password
    const valid = await argon.verify(user.hash, dto.password);
    //if password is not correct throw error
    if (!valid) {
      throw new ForbiddenException('password is not correct');
    }
    // delete user.hash;
    // return user;
    return this.signToken(user.id, user.email);
  }

  //promise<string> is the return type
  signToken(userId: number, email: string): Promise< string > {
    const playload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('SECRET_KEY');
    const token = this.jwt.signAsync(playload, { secret });
    return token;
    // return this.jwt.signAsync(playload, { secret });
  }
}
