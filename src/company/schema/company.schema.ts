/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'companies' })
export class Company {
  @Prop({
    unique: true,
    required: true
  })
  COMPANY_GUID: string
  
  @Prop({ required: true })
  COMPANY_NAME: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date
}

export const CompanySchema = SchemaFactory.createForClass(Company);
