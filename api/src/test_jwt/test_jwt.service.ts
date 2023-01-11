import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestJwtService {
    constructor(private prismaService: PrismaService) {}

    insert(email: string, username: string) {
        return this.prismaService.user.create({
            data: {
                email,
                username,
            },
        });
    }

    find(email: string) {
        return this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany({});
    }
}
