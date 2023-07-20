/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateDataAlamDto {
  @IsNotEmpty()
  ketinggian: string

  @IsNotEmpty()
  curahHujan: string

  @IsNotEmpty()
  suhuRataRata: number

  @IsNotEmpty()
  jenisVegetasi: number

  @IsNotEmpty()
  jumlahVegetasi: string
}