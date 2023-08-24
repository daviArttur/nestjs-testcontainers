import { Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from 'src/usecase/create-user';
import { Body, ValidationPipe } from '@nestjs/common';
import { CreateUseDtoInfra } from 'src/dto/create-user';

@Controller('/users')
export class CreateUserController {
  constructor(private usecase: CreateUserUseCase) {}

  @Post()
  async handle(@Body(new ValidationPipe()) dto: CreateUseDtoInfra) {
    await this.usecase.perform(dto);
  }
}
