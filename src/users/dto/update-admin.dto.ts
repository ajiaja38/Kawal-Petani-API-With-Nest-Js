/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateAdminDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  telpon: string;

  @IsNotEmpty()
  COMPANY_GUID: string;

  @IsNotEmpty()
  provinsi: string;
  
  @IsNotEmpty()
  kabupaten: string;

  @IsNotEmpty()
  kecamatan: string;
  
  @IsNotEmpty()
  kelurahan: string;
}
