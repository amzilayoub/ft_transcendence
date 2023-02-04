import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }

    @Get(':userId')
    findAll(
        @Param('userId') userId: number,
    ) {
        return this.gameService.findAll(userId);
    }

    @Get('top-players')
    async getTopUsers() {
        const users = await this.gameService.getTopUsers();
        return users;
    }
}
