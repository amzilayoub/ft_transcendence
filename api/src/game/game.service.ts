import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';



// model games {
//     id Int @id @default(autoincrement())

//     userLink user @relation("userLink", fields: [player_1], references: [id], onDelete: Cascade)
//     player_1 Int

//     userLink2 user @relation("userLink2", fields: [player_2], references: [id], onDelete: Cascade)
//     player_2  Int

//     player_1_score Int
//     player_2_score Int

//     winner Int
//     mode  String

//     created_at DateTime @default(now())
// }



@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createGameDto: CreateGameDto) {
        try {
            await this.prisma.$queryRaw(Prisma.sql`
                INSERT INTO games (player_1, player_2, player_1_score, player_2_score, winner, mode)
                VALUES (${createGameDto.player_1}, ${createGameDto.player_2}, ${createGameDto.player_1_score}, ${createGameDto.player_2_score}, ${createGameDto.winner}, ${createGameDto.mode});
            `);
            await this.prisma.$queryRaw(Prisma.sql`
                UPDATE users
                SET score = score + 1
                WHERE id = ${createGameDto.winner};
            `);
        } catch (error) {
            //console.log('error:', error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    async findAll(userID: number, offset = 0, limit = 10) {
        /* 
      

model games {
    id Int @id @default(autoincrement())

    userLink user @relation("userLink", fields: [player_1], references: [id], onDelete: Cascade)
    player_1 Int

    userLink2 user @relation("userLink2", fields: [player_2], references: [id], onDelete: Cascade)
    player_2  Int

    player_1_score Int
    player_2_score Int

    winner Int
    mode  String

    created_at DateTime @default(now())
}



      */
        try {
            const games = await this.prisma.games.findMany({
                skip: offset,
                take: limit,
                where: {
                    OR: [
                        {
                            player_1: userID,
                        },
                        {
                            player_2: userID,
                        },
                    ],
                },
                // get more info about the user from the user table
                include: {
                    userLink: {
                        select: {
                            id: true,
                            username: true,
                            avatar_url: true,
                        },
                    },
                    userLink2: {
                        select: {
                            id: true,
                            username: true,
                            avatar_url: true,
                        },
                    },
                },
            });

            return games.map((game) => {
                return {
                    id: game.id,
                    player1: {
                        id: game.userLink.id,
                        username: game.userLink.username,
                        avatar_url: game.userLink.avatar_url,
                        score: game.player_1_score,
                    },
                    player2: {
                        id: game.userLink2.id,
                        username: game.userLink2.username,
                        avatar_url: game.userLink2.avatar_url,
                        score: game.player_2_score,
                    },
                    winner: game.winner,
                    mode: game.mode,
                    created_at: game.created_at,
                };
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            }
        }
    }

    

    async getStats(userID: number) {
        const games = await this.prisma.games.findMany({
            where: {
                OR: [
                    {
                        player_1: userID,
                    },
                    {
                        player_2: userID,
                    },
                ],
            },
        });

        const wins = games.filter((game) => game.winner === userID).length;

        return {
            gamesPlayed: games.length,
            wins,
            losses: games.length - wins,
        };
    }
}
