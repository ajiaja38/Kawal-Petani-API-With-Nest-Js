/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class CreatePetaniDto {
  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  nik: string;

  @IsNotEmpty()
  provinsi: string;
  
  @IsNotEmpty()
  kabupaten: string;

  @IsNotEmpty()
  kecamatan: string;
  
  @IsNotEmpty()
  kelurahan: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: string;
}
