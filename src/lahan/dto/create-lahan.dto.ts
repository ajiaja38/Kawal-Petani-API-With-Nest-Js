/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateLahanDto {
  @IsNotEmpty()
  nama: string

  @IsNotEmpty()
  jenis: string

  @IsNotEmpty()
  periodePanen: string

  @IsNotEmpty()
  jumlahTanaman: number

  @IsNotEmpty()
  hasilPanen: number

  @IsNotEmpty()
  hasilLab: string

  @IsNotEmpty()
  luas: number

  @IsNotEmpty()
  owner: string

  @IsNotEmpty()
  COMPANY_GUID: string
}