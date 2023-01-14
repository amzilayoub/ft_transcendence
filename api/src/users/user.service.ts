import { Injectable } from '@nestjs/common';

import { UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async findOneById(id: number) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async findAll(offset = 0, limit = 10) {
        try {
            const users = await this.prisma.user.findMany({
                skip: offset,
                take: limit,
            });
            return users;
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async findOne(username: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
            return user;
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    username: updateUserDto.username,
                    email: updateUserDto.email,
                    first_name: updateUserDto.first_name,
                    last_name: updateUserDto.last_name,
                    avatar_url: updateUserDto.avatar_url,
                    cover_url: updateUserDto.cover_url,
                    isTwoFactorEnabled: updateUserDto.isTwoFactorEnabled,
                },
            });
            return user;
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async remove(id: number) {
        try {
            const user = await this.prisma.user.delete({
                where: {
                    id: id,
                },
            });
            return user;
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async searchByUsername(query: string, offset = 0, limit = 10) {
        const users = await this.prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                },
            },
            select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar_url: true,
                cover_url: true,
                created_at: true,
            },
            skip: offset,
            take: limit,
        });
        return users;
    }

    async getFollowers(username: string) {
        return [];
    }

    async getFollowing(username: string) {
        return [];
    }

    //   model friends {
    //     id Int @id @default(autoincrement())

    //     userLink  user @relation("userLink", fields: [user_id_1], references: [id])
    //     user_id_1 Int

    //     userLink2 user @relation("userLink2", fields: [user_id_2], references: [id])
    //     user_id_2 Int

    //     created_at DateTime @default(now())
    //     updated_at DateTime @updatedAt
    // }

    async followUser(followerId: number, username: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });
        if (user.id === followerId) {
            throw new Error(
                'You cannot follow yourself. Except if you need a hug',
            );
        }

        // const follow = await this.prisma.user.update({
        //     where: {
        //         id: followerId,
        //     },
        //     data: {

        //     },
        // });
        // return follow;
    }

    async unfollowUser(followerId: number, username: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });

        // const unfollow = await this.prisma.user.update({
        //     where: {
        //         id: followerId,
        //     },
        //     data: {
        //     },
        // });

        // return unfollow;
    }

    async followsUser(followerId: number, username: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });

        // const follows = await this.prisma.user.findUnique({
        //     where: {
        //         id: followerId,
        //     },
        //     select: {
        //         following: {
        //             where: {
        //                 followerId: followerId,
        //                 followingId: user.id,
        //             },
        //         },
        //     },
        // });

        // return follows.following.length > 0;
        return false;
    }
}
