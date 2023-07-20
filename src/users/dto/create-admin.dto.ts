/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class CreateAdminDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  telpon: string;

  @IsNotEmpty()
  provinsi: string;
  
  @IsNotEmpty()
  kabupaten: string;

  @IsNotEmpty()
  kecamatan: string;
  
  @IsNotEmpty()
  kelurahan: string;

  role: string;
}
