import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { FortyTwoUserDto } from './dto/auth.dto';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,

        private readonly configService: ConfigService,
    ) {}

    // Thanks to setting the isSecondFactorAuthenticated property, we can now distinguish between tokens created with and without two-factor authentication.
    public getCookieWithJwtToken(
        _user: any,
        isSecondFactorAuthenticated = false,
    ) {
        const payload = {
            user: {
                id: _user.id,
                username: _user.username,
                email: _user.email,
                intra_url: _user.intra_url,
                avatar_url: _user.avatar_url,
                isTwoFactorEnabled: _user.isTwoFactorEnabled,
                TwoFactorSecret: _user.TwoFactorSecret,
            },
            isSecondFactorAuthenticated,
        };

        const token = this.jwt.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${
            60 * 60 * 24 * 7
        }`;
    }

    async add42User(dto: FortyTwoUserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: dto.login,
                    nickname: dto.login,
                    email: dto.email,
                    first_name: dto.first_name || null,
                    last_name: dto.last_name || null,
                    intra_id: dto.id,
                    intra_url: dto.intra_url,
                    avatar_url: dto.image.versions.large,
                    // isTwoFactorEnabled: dto.twoFactorAuth,
                },
            });
            return user;
        } catch (error) {
            //console.log('error:', error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async getAccessToken(code: string) {
        let ret: string;
        const payload = {
            grant_type: 'authorization_code',
            client_id: this.configService.get('CLIENT_ID'),
            client_secret: this.configService.get('CLIENT_SECRET'),
            redirect_uri: this.configService.get('CALLBACK_URL'),
            code: code,
        };
        await axios({
            method: 'post',
            url: 'https://api.intra.42.fr/oauth/token',
            data: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                ret = res.data.access_token;
                return ret;
            })
            .catch((err: AxiosError) => {
                console.log(err.response.data);
            });
        return ret;
    }

    async lesInformationsDeLutilisateur(token: string) {
        let ret: any;
        await axios({
            method: 'get',
            url: 'https://api.intra.42.fr/v2/me',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                ret = res.data;
                return ret;
            })
            .catch((err: AxiosError) => {
                err.response.data;
            });
        return ret;
    }

    async checkIfUserExist(user: number) {
        const is_here = await this.prisma.user.findFirst({
            where: {
                intra_id: user,
            },
        });
        return is_here;
    }

    public getCookieForLogOut() {
        return `Authentication=; Path=/; Max-Age=0`;
    }

    async enableTwoFactor(user: UserDto) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isTwoFactorEnabled: true,
            },
        });
    }

    async disableTwoFactor(user: UserDto) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isTwoFactorEnabled: false,
            },
        });
    }

    async addSecret(user: UserDto, secret: string) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                TwoFactorSecret: secret,
            },
        });
    }

    async getMe(id: number) {
        return await this.prisma.user.findUnique({
            where: { id: id },
        });
    }
}
