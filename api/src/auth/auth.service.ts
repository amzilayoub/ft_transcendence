import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {
    return 'This action returns a login';
  }

  logout() {
    return 'This action returns a logout';
  }
}
