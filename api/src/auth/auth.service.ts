import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { FortyTwoUserDto } from './dto/auth.dto';
import axios, { AxiosError } from 'axios';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

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

        // console.log('token:token', payload);
        const token = this.jwt.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${
            60 * 60 * 24 * 7
        }`;
    }

    public getJwtToken(_user: any, isSecondFactorAuthenticated?: boolean) {
        const payload = {
            user: {
                username: _user.username,
                email: _user.email,
                first_name: _user.first_name,
                last_name: _user.last_name,
                intra_id: _user.intra_id,
                intra_url: _user.intra_url,
                avatar_url: _user.avatar_url,
                isTwoFactorEnabled: _user.isTwoFactorEnabled,
                TwoFactorSecret: _user.TwoFactorSecret,
                id: _user.id,
            },
            isSecondFactorAuthenticated,
        };
        const token = this.jwt.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });
        return `Authentication=${token}; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
    }

    async add42User(dto: FortyTwoUserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: dto.login,
                    email: dto.email,
                    first_name: dto.first_name || null,
                    last_name: dto.last_name || null,
                    intra_id: dto.id,
                    intra_url: dto.intra_url,
                    avatar_url: dto.image.versions.large,
                    isTwoFactorEnabled: dto.twoFactorAuth,
                },
            });
            return user;
        } catch (error) {
            console.log('error:', error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async getAccessToken(code: string) {
        let ret: string;
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.CALLBACK_URL,
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

    async enableTwoFactor(user: FortyTwoUserDto) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isTwoFactorEnabled: true,
            },
        });
    }

    async disableTwoFactor(user: FortyTwoUserDto) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isTwoFactorEnabled: false,
            },
        });
    }

    async addSecret(user: FortyTwoUserDto, secret: string) {
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

// async checkIfUserHas2fa(user: number) : Promise<boolean> {
//   const is_here = await this.prisma.user.findFirst({
//     where: {
//       intra_id: user,
//     },
//   });
//   return is_here.isTwoFactorEnabled;
// }

// async getByEmail(dto: AuthDto) {
//   const user = await this.prisma.user.findUnique({
//     where: {
//       email: dto.email,
//     },
//   });
//   if (!user) {
//     throw new ForbiddenException('User with this email does not exist');
//   }
//   await this.verifyPassword(dto.password, user.hash);
//   delete user.hash;
//   return user;
// }

// async verifyPassword(password: string, hash: string) {
//   const isPasswordValid = await argon.verify(hash, password);
//   if (!isPasswordValid) {
//     throw new ForbiddenException('Invalid password');
//   }
// }

// async addNewUser(dto: AuthDto) {
//   try
//   {
//     const hash = await argon.hash(dto.password);
//       const user = await this.prisma.user.create({
//         data: {
//           username: dto.username,
//           email: dto.email,
//           hash,
//           first_name: dto.first_name || null,
//           last_name: dto.last_name || null,
//         },
//       });
//       return user;
//   } catch (error) {
//   if (error instanceof PrismaClientKnownRequestError) {
//     if (error.code === 'P2002') {
//       throw new ForbiddenException('Email already in use');
//     }
//     throw error;
//   }
// }
// }
