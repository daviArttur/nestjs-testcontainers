import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/interfaces';
import { UserRepositoryPrisma } from 'src/repository/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepositoryPrisma) {}

  async perform(dto: CreateUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (user) {
      throw new HttpException('Já existe um usuário com esse e-mail', 422);
    }

    await this.userRepository.create(dto);
  }
}
