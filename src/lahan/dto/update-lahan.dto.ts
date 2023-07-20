/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateLahanDto {
  @IsNotEmpty()
  jenisTanah: string

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
  owner: Types.ObjectId
}