/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  email: number

  @IsNotEmpty()
  password: number
}