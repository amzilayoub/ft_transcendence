import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { Prisma } from '@prisma/client';
import fs = require('fs');
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const prismaService = app.get(PrismaService);
    /*
     ** Insert data
     */
    const is_init_data: Array<any> = await prismaService.$queryRaw(Prisma.sql`
		SELECT *
		FROM room_type
	`);
    if (is_init_data.length == 0) {
        const initial_data = fs
            .readFileSync(join(process.cwd(), './initial_data.sql'))
            .toString();
        const queries = initial_data.split(';');
        for (let i in queries) {
            // console.log(queries[i]);
            await prismaService.$executeRawUnsafe(queries[i]);
        }
    }
    app.enableCors({
        origin: configService.get('FRONTEND_URL'),
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // remove any properties that are not defined in the DTO
            transform: true,
        }),
    );
    app.use(cookieParser());
    const config = new DocumentBuilder()
        .setTitle('transcendence')
        .setDescription('The transcendence API description')
        .setVersion('1.0')
        .addTag('transcendence')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
