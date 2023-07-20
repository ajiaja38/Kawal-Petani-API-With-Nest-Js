/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  telpon: string;

  role: string;
}
