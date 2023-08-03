/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateTanamanDto {
  @IsNotEmpty()
  guidPetani: string
  
  @IsNotEmpty()
  guidLahan: string
  
  @IsNotEmpty()
  nama: string

  @IsNotEmpty()
  latitude: string

  @IsNotEmpty()
  longitude: string
}