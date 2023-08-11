/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  COMPANY_NAME: string
}