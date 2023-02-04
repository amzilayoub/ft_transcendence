import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';


@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createGameDto: CreateGameDto) {
      
        try {
          return this.prisma.$queryRaw(Prisma.sql`
            INSERT INTO games (player_1, player_2, winner, mode)
            VALUES (${createGameDto.player_1}, ${createGameDto.player_2}, ${createGameDto.winner}, ${createGameDto.mode})
          `);

        } catch (error) {
            //console.log('error:', error);
            if (error instanceof PrismaClientKnownRequestError) {
                throw error;
            } 
        }
    }

    async findAll(
      userID: number,
        offset = 0,
        limit = 10,
    ) {
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
        });
        return games;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw error;
        }
      }
    }


    async getTopUsers(
      offset = 0,
      limit = 10,
  ) {
      const users = await this.prisma.user.findMany({
          select: {
              id: true,
              username: true,
              avatar_url: true,
              score: true,
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
