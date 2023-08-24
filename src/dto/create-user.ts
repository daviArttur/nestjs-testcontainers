import { CreateUserDto } from 'src/interfaces';
import { IsEmail, IsString } from 'class-validator';

export class CreateUseDtoInfra implements CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
