/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  COMPANY_NAME: string
}