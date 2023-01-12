import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
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
