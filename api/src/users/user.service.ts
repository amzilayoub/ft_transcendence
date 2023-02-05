import { Injectable,
    HttpException,
    HttpStatus, } from '@nestjs/common';

import { UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';

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
            //console.log(error);
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
            //console.log(error);
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
            //console.log(error);
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
                    nickname: updateUserDto.nickname,
                    first_name: updateUserDto.first_name,
                    last_name: updateUserDto.last_name,
                    bio: updateUserDto.bio,
                    avatar_url: updateUserDto.avatar_url,
                    cover_url: updateUserDto.cover_url,
                },
            });
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
            if (error.code === 'P2002') {
                throw new HttpException('Nickname is already taken', HttpStatus.BAD_REQUEST);
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
            //console.log(error);
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

    async searchFriendsByUsername(query: string, offset = 0, limit = 10) {
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
                avatar_url: true,
            },
            skip: offset,
            take: limit,
        });
        return users;
    }

    async getFriends(username: string) {
        // const friends = await this.prisma.user.findMany({
        //     where: {
        //         username: username,
        //     },
        //     select: {
        //         friends: {
        //             select: {
        //                 userLink2: {
        //                     select: {
        //                         id: true,
        //                         username: true,
        //                         nickname: true,
        //                         avatar_url: true,
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // });
        // return friends[0].friends.map((friend) => friend.userLink2);
        const friends = await this.prisma.$queryRaw(Prisma.sql`
        SELECT DISTINCT users.*
        FROM friends
        INNER JOIN users ON (friends.user_id_2 = users.id OR friends.user_id_1 = users.id)
        WHERE (friends.user_id_1 IN ((SELECT users.id FROM users WHERE users.username = ${username}))
        OR friends.user_id_2 IN ((SELECT users.id FROM users WHERE users.username = ${username})))
        AND friends.user_id_1 != friends.user_id_2
        AND users.username != ${username}
        `
        );
        console.log("###", friends);
        return friends;

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
        if (followerId !== user.id) {
            return await this.prisma.$queryRaw(Prisma.sql`
                INSERT INTO friends (user_id_1, user_id_2, updated_at)
                VALUES (${followerId}, ${user.id}, NOW())   
            `)
        }
        return null;
    }

    async unfollowUser(userId: number, username: string) {
        const q = await this.prisma.$queryRaw(Prisma.sql`
        DELETE FROM friends
        WHERE user_id_1 = ${userId}
        AND user_id_2 IN (SELECT id FROM users WHERE username = ${username})
        `);
        return q
    }

    // checks if user follows the other user
    async isfollowingsUser(userId1: number, username: string) {
        // check if user follows the other user without selecting any data
        const q = await this.prisma.$queryRaw(Prisma.sql`
        SELECT *
        FROM friends 
        WHERE user_id_1 IN (${userId1})
        AND user_id_2 IN ((SELECT id FROM users WHERE username = ${username}))
        `
        );
        console.log({q});
        return !!q[0];
    }

    async getTopUsers(offset = 0, limit = 10) {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                avatar_url: true,
                score: true,
            },
            where: {
                score: {
                    gt: 0,
                },
            },
            orderBy: {
                score: 'desc',
            },
            skip: offset,
            take: limit,
        });
        return users;
    }
}
