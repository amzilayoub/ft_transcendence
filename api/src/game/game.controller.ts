import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    create(@Body() createGameDto: any) {
        console.log('createGameDto:', createGameDto);
        return this.gameService.create(createGameDto);
    }

    @Get(':userId')
    findAll(@Param('userId') userId: number) {
        return this.gameService.findAll(userId);
    }


    @Get('stats/:userId')
    async getStats(@Param('userId') userId: number) {
        if (isNaN(userId)) throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
        const stats = await this.gameService.getStats(userId);
        return stats;
    }
}
