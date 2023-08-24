import { CreateUserDto } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserRepositoryPrisma {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    try {
      const userDb = await this.prisma.users.findUnique({
        where: {
          email,
        },
      });

      return userDb ? { email: userDb.email, name: userDb.name } : null;
    } catch (err) {
      throw new Error();
    }
  }

  async create(dto: CreateUserDto) {
    try {
      await this.prisma.users.createMany({
        data: {
          email: dto.email,
          name: dto.name,
        },
      });
    } catch (err) {
      throw new Error();
    }
  }
}
