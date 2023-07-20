/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class TrajectoriesDto {
  @IsNotEmpty()
  lat: number

  @IsNotEmpty()
  long: number
}