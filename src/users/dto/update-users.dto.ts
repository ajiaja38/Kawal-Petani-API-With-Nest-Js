/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  telpon: string;

  role: string;
}
