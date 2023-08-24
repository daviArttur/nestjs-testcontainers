import { Module } from '@nestjs/common';
import { CreateUserController } from './controller/create-user';
import { CreateUserUseCase } from './usecase/create-user';
import { UserRepositoryPrisma } from './repository/user.repository';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
  ],
  controllers: [CreateUserController],
  providers: [UserRepositoryPrisma, CreateUserUseCase],
})
export class AppModule {}
